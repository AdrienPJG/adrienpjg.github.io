document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.getElementById("footer");
  if (footerContainer) {
    fetch("../src/footer.html")
      .then(response => response.text())
      .then(html => {
        footerContainer.innerHTML = html;
      })
      .catch(error => {
        console.error("Erreur lors du chargement du footer :", error);
      });
  }
});
