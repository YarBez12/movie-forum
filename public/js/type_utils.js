// Handle type buttons (all, official, community)
const typeButtons = document.querySelectorAll(".type-link");
typeButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    // Set additional URL parameter and update page
    const url = new URL(window.location.href);
    url.searchParams.set("type", button.dataset.type);
    window.location.replace(url.toString());
  });
});