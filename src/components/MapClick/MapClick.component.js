/**
 * Author: Amr Samir
 *
 * Description:
 *  - An example of a plugin that listens to another
 *    plugin's state changes (Map plugin), and log that state.
 */

import React from "react";
import { connect } from "react-redux";
import { selectorsRegistry, actionsRegistry } from "@penta-b/ma-lib";
import { drawFeautres } from "../../services/mapUtils";
import * as turf from "@turf/turf";
import { callQueryService } from "../../services/queryService";

class MapClickComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleResp = this.handleResp.bind(this);
    }

    handleResp(res) {
        // console.log(res);
        const data = JSON.parse(res.data[0].features);

        console.log(data);
        this.id && this.props.removeMapClickResult(this.id);
        const currentClick = this.props.singleClick;

        this.props.showMapClickResult(
            {
                coordinate: currentClick.coordinate,
                info: data,
            },
            (id) => (this.id = id)
        );
        return res;
    }

    /**
     * Description:
     *  - React lifecycle method, here we check for state changes.
     */

    componentDidUpdate(prevProps) {
        if (this.props.isActive) {
            const prevClick = prevProps.singleClick;
            const currentClick = this.props.singleClick;
            const point =
                currentClick &&
                turf.point([
                    currentClick?.coordinate?.[0],
                    currentClick?.coordinate?.[1],
                ]);
            const buffer =
                point && turf.buffer(point, 0.3, { units: "kilometers" });
            if (currentClick && currentClick != prevClick && buffer) {
                console.log(point);
                console.log(buffer);
                const { ganoushLayer } = this.props.settings.dataSettings;
                drawFeautres([buffer], {
                    vectorLayerOptions: { clear: true },
                    styleOptions: {
                        color: "#f00000A0",
                    },
                });
                // query all layers using the buffer
                // wait for query resp and pass it to showmapCLickResult
                callQueryService(ganoushLayer, this.handleResp, buffer);
            }
        }
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        singleClick: selectorsRegistry.getSelector(
            "selectMapSingleClick",
            state,
            ownProps.reducerId
        ),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showMapClickResult: (props, onAdd) =>
            dispatch(
                actionsRegistry.getActionCreator(
                    "showComponent",
                    "ma-plugin-ganoushPlugin",
                    "ganoushIdentifierTable",
                    props,
                    onAdd
                )
            ),
        removeMapClickResult: (id) =>
            dispatch(actionsRegistry.getActionCreator("removeComponent", id)),
        notify: (message, type) => {
            dispatch(
                systemAddNotification({
                    message,
                    type,
                })
            );
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapClickComponent);
