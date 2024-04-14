let img = document.getElementById("image");
let overLayer = document.getElementById("overlay");
let text = document.getElementById("text");
let userInput = prompt("Paste the image link, or leave it blank to load my selfie:");

if (!userInput) {
    img.src = "./img/Carson.png";
} else {
    (async () => {
        let response = await fetch(userInput);
        let blob = await response.blob();
        img.src = URL.createObjectURL(blob);
    })();
}

let initialized = new Promise((resolve) => {
    window.addEventListener('initialized', resolve);
});

let imgloaded = new Promise((resolve) => {
    img.onload = () => {
        resolve();
    };
});

(async () => {
    await Promise.all([initialized, imgloaded]);
    overLayer.viewBox.baseVal.width = img.naturalWidth;
    overLayer.viewBox.baseVal.height = img.naturalHeight;
    let content = new DocumentFragment;
    let faces = media.detect(img).detections;
    for (face of faces) {
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", face.boundingBox.originX);
        rect.setAttribute("y", face.boundingBox.originY);
        rect.setAttribute("width", face.boundingBox.width);
        rect.setAttribute("height", face.boundingBox.height);
        content.appendChild(rect);
        for (point of face.keypoints) {
            let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", point.x * img.naturalWidth);
            circle.setAttribute("cy", point.y * img.naturalHeight);
            circle.setAttribute("r", "1");
            content.appendChild(circle);
        }
        overLayer.append(content);
        text.textContent = (face.categories[0].score * 100).toFixed(1) + "%";
        text.style.top = (face.boundingBox.originY + face.boundingBox.height) / img.naturalHeight * 100 + "%";
        text.style.left = face.boundingBox.originX/ img.naturalWidth * 100 + "%";
    }
    if (!faces.length) {
        setTimeout(() => {
            alert("No face detected!");
            window.location.reload();
        }, 250);
    }
})();