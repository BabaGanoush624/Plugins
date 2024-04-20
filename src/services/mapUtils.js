// importing the required registries
import { apiRegistry, actionsRegistry } from "@penta-b/ma-lib";
//vectorLayer declaration
let VL = null;

// Checking the if the vector layer already exists to clear all the features on it(which won't happen until after the first click)
export const validateVL = async (options) => {
    if (!VL) {
        const [VectorLayer] = await apiRegistry.getApis(["VectorLayer"]);
        VL = new VectorLayer();
        actionsRegistry.dispatch("addVectorLayer", VL);
    } else {
        options.clear && VL.clear();
    }
};

const generateStyle = async (styleOptions) => {
    const [Style, Fill, Stroke] = await apiRegistry.getApis([
        "Style",
        "Fill",
        "Stroke",
    ]);
    let style;
    style = new Style(
        new Fill(styleOptions.color),
        new Stroke("#000000", 1, null) //takes Color(string), width, lineDash
    );
    return style;
};

//converting the geoJsonFeature(buffer) into olFeature that can be drawn on the map
const generateFeature = async (GEOJSONFeature) => {
    const [Feature] = await apiRegistry.getApis(["Feature"]);
    return new Feature({ ...GEOJSONFeature });
};

// drawing the GEOJSONFeature (buffer) on the map
export const drawFeautres = async (GEOJSONFeatures, options) => {
    await validateVL(options.vectorLayerOptions);
    const features = await Promise.all(GEOJSONFeatures.map(generateFeature)); // iterates over the geoArray and calls the generateFeature on each item in the array (buffer only since we have one item in the array)
    const style = await generateStyle(options.styleOptions);
    VL.setStyle(style); // is this style applied to the whole of vector layer and not to the specified feature only
    VL.addFeatures(features); // adding the feature generated to the vectorLayer
};
