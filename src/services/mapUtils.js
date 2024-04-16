import { apiRegistry, actionsRegistry } from "@penta-b/ma-lib";

let VL = null;

const validateVL = async (options) => {
    if (!VL) {
        const [VectorLayer] = await apiRegistry.getApis(["VectorLayer"]);
        VL = new VectorLayer();
        actionsRegistry.dispatch("addVectorLayer", VL);
    } else {
        options.clear && VL.clear();
    }
};

const generateStyle = async (styleOptions) => {
    const [Style, Fill, Stroke, Circle] = await apiRegistry.getApis([
        "Style",
        "Fill",
        "Stroke",
        "Circle",
    ]);
    let style;
    style = new Style(
        new Fill(styleOptions.color),
        new Stroke("#000000", 1, null),
        new Circle(
            new Fill(styleOptions.color),
            new Stroke("#000000", 1, null),
            7
        )
    );
    return style;
};

const generateFeature = async (GEOJSONFeature) => {
    const [Feature] = await apiRegistry.getApis(["Feature"]);
    return new Feature({ ...GEOJSONFeature });
};

export const drawFeautres = async (GEOJSONFeatures, options) => {
    await validateVL(options.vectorLayerOptions);
    const features = await Promise.all(GEOJSONFeatures.map(generateFeature));
    const style = await generateStyle(options.styleOptions);
    VL.setStyle(style);
    VL.addFeatures(features);
};
