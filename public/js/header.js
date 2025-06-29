document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header");
  if (headerContainer) {
    fetch("../src/header.html")
      .then(response => response.text())
      .then(html => {
        headerContainer.innerHTML = html;
      })
      .catch(error => {
        console.error("Erreur lors du chargement du header :", error);
      });
  }
});