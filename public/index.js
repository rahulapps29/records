document.addEventListener("DOMContentLoaded", async () => {
  // Get the current name from the URL (like /rovin or /tiya)
  const pathSegments = window.location.pathname.split("/");
  const name = pathSegments.length > 1 ? pathSegments[1] : "";

  // Fetch transaction data, using the name parameter if present
  const response = await fetch(`/api/data/${name}`);
  let transactionsData = await response.json();

  let transactions = transactionsData.tasks;
  let transactionCount = transactionsData.taskCount;

  let totalAmt = 0;
  transactions.forEach((card) => {
    totalAmt += card.Amt;
  });
  console.log(totalAmt);

  function grandtotal() {
    document.getElementById(
      "grandtotal"
    ).innerHTML = `Closing Bal: ${totalAmt} : Tran count: ${transactionCount} `;
  }
  grandtotal();

  // Parse transaction data by month
  const monthlySummary = transactions.reduce((summary, transaction) => {
    const date = new Date(transaction.TransactionDate);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    if (!summary[monthYear]) {
      summary[monthYear] = { gave: 0, got: 0 };
    }

    if (transaction.DebitCredit === "gave") {
      summary[monthYear].gave += transaction.Amt;
    } else if (transaction.DebitCredit === "got") {
      summary[monthYear].got += transaction.Amt;
    }

    return summary;
  }, {});

  // Sort by month and calculate running total
  let runningTotal = 0;
  const monthlySummaryArray = Object.entries(monthlySummary)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([monthYear, { gave, got }]) => {
      const netChange = gave + got;
      runningTotal += netChange;
      return { monthYear, gave, got, runningTotal };
    });

  // Populate the table
  const tableBody = document.getElementById("table-body");
  monthlySummaryArray.forEach(({ monthYear, gave, got, runningTotal }) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${monthYear}</td>
    <td>${gave.toLocaleString()}</td>
    <td>${got.toLocaleString()}</td>
    <td>${runningTotal.toLocaleString()}</td>`;
    tableBody.appendChild(row);
  });
});

const toggleButton = document.getElementById("mode-toggle");
const body = document.body;

// Set dark mode as default
body.classList.add("dark-mode");

// Update button text on load
toggleButton.textContent = "Light";

toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  toggleButton.textContent = body.classList.contains("dark-mode")
    ? "Light"
    : "Dark";
});
