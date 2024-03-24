import { store, query, systemShowLoading, systemHideLoading } from "@penta-b/ma-lib";
const genQueryBody = (layer) => {
  return [
    {
      dataSource: {
        id: layer.id,
      },
      crs: layer.crs,
    },
  ];
};

export const callQueryService = async (layer) => {
  store.dispatch(systemShowLoading());
  return await query
    .queryFeatures(genQueryBody(layer))
    .then((response) => {
      return JSON.parse(response.data[0].features).features;
    })
    .catch((error) => {
      console.log(error);
      return false;
    })
    .finally(() => {
      store.dispatch(systemHideLoading());
    });
};