let buttons = document.querySelectorAll("button");
let alert = document.querySelector("p");
let img = document.querySelector("img");
let overLayer = document.querySelector("div");

buttons[0].onclick = () => {
    (async () => {
        let clipboard = await navigator.clipboard.readText()
        let response = await fetch(clipboard);
        let blob = await response.blob();
        img.src = URL.createObjectURL(blob);
    })();
    detect();
}

buttons[1].onclick = () => {
    img.src = "./img/Carson.png";
    detect();
}

function detect() {
    img.onload = () => {
        let faces = media.detect(img).detections;
        let content = new DocumentFragment;
        if (!faces.length) {
            alert.textContent = "No face detected!";
        } else {
            alert.textContent = "";
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", `0 0 ${img.naturalWidth} ${img.naturalHeight}`);
            for (face of faces) {
                let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", face.boundingBox.originX);
                rect.setAttribute("y", face.boundingBox.originY);
                rect.setAttribute("width", face.boundingBox.width);
                rect.setAttribute("height", face.boundingBox.height);
                svg.appendChild(rect);
                for (point of face.keypoints) {
                    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    circle.setAttribute("cx", point.x * img.naturalWidth);
                    circle.setAttribute("cy", point.y * img.naturalHeight);
                    circle.setAttribute("r", "1");
                    svg.appendChild(circle);
                }
                let text = document.createElement("p")
                text.textContent = (face.categories[0].score * 100).toFixed(1) + "%";
                text.style.top = (face.boundingBox.originY + face.boundingBox.height) / img.naturalHeight * 100 + "%";
                text.style.left = face.boundingBox.originX/ img.naturalWidth * 100 + "%";
                text.classList.add("confidence");
                content.append(svg, text);
            }
        }
        overLayer.replaceChildren(content);
    }
}