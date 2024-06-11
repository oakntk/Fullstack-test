document.addEventListener("DOMContentLoaded", () => {
  const gdpTableBody = document.querySelector(".gdp-table tbody");
  const gdpForm = document.querySelector("#gdpForm");
  const provinceInput = document.querySelector("#province");
  const gdpInput = document.querySelector("#gdp");

  const loadInitialGdpData = () => {
    console.log("Fetching initial GDP data...");
    fetch("ThailandGDP.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Initial GDP Data:", data);
        localStorage.setItem("gdpEntries", JSON.stringify(data));
        loadGdpEntries();
      })
      .catch((error) =>
        console.error("Error loading initial GDP data:", error)
      );
  };

  const loadGdpEntries = () => {
    const entries = JSON.parse(localStorage.getItem("gdpEntries")) || [];
    console.log("Loaded GDP Entries from localStorage:", entries);
    gdpTableBody.innerHTML = "";
    entries.forEach((entry) => displayGdpEntry(entry));
  };

  const displayGdpEntry = (entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${entry.Province_ENG}</td>
        <td>${entry.GPP2020}</td>
        <td><button class="delete-btn" data-province="${entry.Province_ENG}">
            <i class="fas fa-trash"></i>
        </button></td>
    `;
    gdpTableBody.appendChild(tr);

    tr.querySelector(".delete-btn").addEventListener("click", () => {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this entry?"
      );
      if (shouldDelete) {
        deleteGdpEntry(entry.Province_ENG);
      }
    });
  };

  gdpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const province = provinceInput.value.trim();
    const gdp = parseFloat(gdpInput.value.trim());

    if (province && !isNaN(gdp)) {
      const newEntry = { Province_ENG: province, GPP2020: gdp };
      console.log("Adding new entry:", newEntry);
      saveGdpEntry(newEntry);
      displayGdpEntry(newEntry);
      gdpForm.reset();
    }
  });

  const saveGdpEntry = (entry) => {
    const entries = JSON.parse(localStorage.getItem("gdpEntries")) || [];
    entries.push(entry);
    console.log("Saving entries to localStorage:", entries);
    localStorage.setItem("gdpEntries", JSON.stringify(entries));
  };

  const deleteGdpEntry = (province) => {
    let entries = JSON.parse(localStorage.getItem("gdpEntries")) || [];
    entries = entries.filter((entry) => entry.Province_ENG !== province);
    console.log("Entries after deletion:", entries);
    localStorage.setItem("gdpEntries", JSON.stringify(entries));
    loadGdpEntries();
  };

  if (!localStorage.getItem("gdpEntries")) {
    loadInitialGdpData();
  } else {
    loadGdpEntries();
  }
});
