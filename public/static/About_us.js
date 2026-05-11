document.addEventListener("DOMContentLoaded", () => {
    const listItems = document.querySelectorAll("main ul li");
    listItems.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateX(-20px)";
        item.style.transition = "all 0.4s ease forwards";
        
        setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateX(0)";
        }, 300 + (index * 200)); 
    });
});