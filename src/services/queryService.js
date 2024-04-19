import {
    store,
    query,
    systemShowLoading,
    systemHideLoading,
} from "@penta-b/ma-lib";

const genQueryBody = (layer, buffer) => {
    return [
        {
            dataSource: {
                id: layer[0].id,
            },
            returns: [],
            filter: {
                conditionList: [
                    {
                        key: layer[0].geometryField.fieldName,
                        geometry: JSON.stringify(buffer.geometry),
                        spatialRelation: "INTERSECT",
                    },
                ],
            },
            crs: layer[0].crs,
        },
    ];
};

export const callQueryService = async (layer, action, buffer) => {
    store.dispatch(systemShowLoading());
    query
        .queryFeatures(genQueryBody(layer, buffer))
        // .then(res => JSON.parse(res))
        .then((response) => {
            action(response);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            store.dispatch(systemHideLoading());
        });
};
