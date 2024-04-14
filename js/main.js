let img = document.getElementById("image");
let overLayer = document.getElementById("overlay");
let text = document.getElementById("text");
let userInput = prompt("Paste the image link:", "https://pixabay.com/get/g0080dc78cf05efca32ab8ec07c5c7e84c68e8d72316e2b75233fd8acf8c14e4276422be7e997fa0aa390d92c946df49a66e3bd7bcc50560ff452b4b4fd6b5be3_1280.jpg");

(async () => {
    let response = await fetch(userInput);
    let blob = await response.blob();
    img.src = URL.createObjectURL(blob);
})();

window.addEventListener('initialized', () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - loadtime;
    console.log(elapsedTime);
    overLayer.viewBox.baseVal.width = img.naturalWidth;
    overLayer.viewBox.baseVal.height = img.naturalHeight;
    let content = new DocumentFragment;
    let face = media.detect(img).detections[0];
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", face.boundingBox.originX);
    rect.setAttribute("y", face.boundingBox.originY);
    rect.setAttribute("width", face.boundingBox.width);
    rect.setAttribute("height", face.boundingBox.height);
    for (point of face.keypoints) {
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", point.x * img.naturalWidth);
         circle.setAttribute("cy", point.y * img.naturalHeight);
        circle.setAttribute("r", "1");
        content.appendChild(circle);
    }
        content.appendChild(rect);
    overLayer.replaceChildren(content);
    text.textContent = (face.categories[0].score * 100).toFixed(1) + "%";
    text.style.top = (face.boundingBox.originY + face.boundingBox.height) / img.naturalHeight * 100 + "%";
    text.style.left = face.boundingBox.originX/ img.naturalWidth * 100 + "%";
});