// need to toggle off inventory button if not an employee or manager

const invToggle = document.querySelector("#invManagBtn")
invToggle.addEventListener("change", function() {
    const invManagBtn = document.querySelector("link")
    invManagBtn.removeAttribute("hidden")
})