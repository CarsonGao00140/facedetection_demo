window.timeCount = [Date.now()];
import { FaceDetector, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let initialize = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    window.media = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU",
            min_detection_confidence: 0.75
        },
    });
    timeCount.push(Date.now());
    // setTimeout(() => window.dispatchEvent(new Event('initialized')), 0);
    window.dispatchEvent(new Event('initialized'));
};

initialize();