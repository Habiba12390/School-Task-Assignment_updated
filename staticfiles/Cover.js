document.addEventListener("DOMContentLoaded", () => {
    const teamRows = document.querySelectorAll("table:last-of-type tbody tr");

    teamRows.forEach((row, index) => {
        row.style.opacity = "0";
        row.style.transform = "translateX(-20px)";
        row.style.transition = "all 0.4s ease forwards";
        
        setTimeout(() => {
            row.style.opacity = "1";
            row.style.transform = "translateX(0)";
        }, 400 + (index * 150)); 
    });
});