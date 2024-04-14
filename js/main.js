let img = document.getElementById("image");
let overLayer = document.getElementById("overlay");
let dialog = document.getElementById("dialog");
let alert = document.getElementById("alert");
let buttonOption1 = document.getElementById("option1");
let buttonOption2 = document.getElementById("option2");

dialog.showModal();

buttonOption1.onclick = () => {
    (async () => {
        let clipboard = await navigator.clipboard.readText()
        let response = await fetch(clipboard);
        let blob = await response.blob();
        img.src = URL.createObjectURL(blob);
    })();
    detect();
}

buttonOption2.onclick = () => {
    img.src = "./img/Carson.png";
    detect();
}

function detect() {
    img.onload = () => {
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
            content.append(rect);
            for (point of face.keypoints) {
                let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", point.x * img.naturalWidth);
                circle.setAttribute("cy", point.y * img.naturalHeight);
                circle.setAttribute("r", "1");
                content.appendChild(circle);
            }
            overLayer.appendChild(content);
            let text = document.createElement("p")
            text.textContent = (face.categories[0].score * 100).toFixed(1) + "%";
            text.style.top = (face.boundingBox.originY + face.boundingBox.height) / img.naturalHeight * 100 + "%";
            text.style.left = face.boundingBox.originX/ img.naturalWidth * 100 + "%";
            text.classList.add("confidence");
            overLayer.after(text);
        }
        if (!faces.length) {
            alert.textContent = "No face detected!";
            dialog.showModal();
        }
    }
}