import React from "react";
import { withLocalize } from "@penta-b/ma-lib";
import { LOCALIZATION_NAMESPACE } from "../../constants/constants";
import { components as GridComponents } from "@penta-b/grid";
const Grid = GridComponents.Grid;

class MapClickResult extends React.Component {
    render() {
        const { info } = this.props;
        let parsedData = info.features.map((feature) => feature.properties);
        console.log("From container", info);
        //make sure that query resp is returned
        // use grid component to view all features
        return (
            <div>
                <Grid
                    settings={{
                        name: "FEATURES",
                        sortable: false,
                        filterable: false,
                        pageSizeOptions: [10, 20, 40],
                        pageSize: 10,
                        enableLargeView: true,
                        columns: [
                            {
                                id: "id",
                                name: "id",
                                type: "INT",
                                display: "basic",
                            },
                            {
                                id: "name",
                                name: "name",
                                type: "STR",
                                display: "basic",
                            },
                        ],
                        data: parsedData,
                    }}
                />
            </div>
        );
    }
}

export default withLocalize(MapClickResult, LOCALIZATION_NAMESPACE);
