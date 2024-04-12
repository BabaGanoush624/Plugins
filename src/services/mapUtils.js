import { store, query, systemShowLoading, systemHideLoading } from '@penta-b/ma-lib';


const genQueryBody = (layer, buffer) => {
  return [
    {
      dataSource: {
        id: layer[0].id,
      },
      returns: [],
      fitler: {
        conditionList: [
          {
            spatialCondition: {
              key: layer[0].geometryField.fieldName,
              geometry: JSON.stringify(buffer.geometry),
              spatialRelation: "INTERSECT",
            },
          },
        ],
      },
      crs: layer[0].crs,
    },
  ];




  /* return [
    {
      // returnAs: "JSON",
      dataSource: {
        id: layer[0].id,
      },
      crs: layer[0].crs,
      // crs: "EPSG:4326",
      filter: {
        conditionList: [
          {
            geometry: JSON.stringify(buffer.geometry),
            key: layer[0].geometryField.fieldName,
            spatialRelation: "INTERSECT"
          }
        ],
        // logicalOperation: "OR",
      }
    },

  ] */
}
export const callQueryService = async (layer, action, buffer) => {
  store.dispatch(systemShowLoading());
  query.queryFeatures(genQueryBody(layer, buffer))
    // .then(res => JSON.parse(res))
    .then((response) => {
      action(response)
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      store.dispatch(systemHideLoading());
    })
}














/* import { apiRegistry, actionsRegistry } from "@penta-b/ma-lib";
import { store, query, systemShowLoading, systemHideLoading } from "@penta-b/ma-lib";
export function createVectorLayer() {
  apiRegistry
    .getApis(["VectorLayer", "Drawing"])
    .then(([VectorLayer, Drawing]) => {
      const vectorLayer = new VectorLayer();
      actionsRegistry.dispatch("addVectorLayer", vectorLayer);
      const drawing = new Drawing({ type: "point", vectorLayer: vectorLayer });
      actionsRegistry.dispatch("addInteraction", drawing);
    });
} */