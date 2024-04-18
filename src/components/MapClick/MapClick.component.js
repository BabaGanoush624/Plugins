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

//inherting the props, State, render method and life cycle methods from React
class MapClickComponent extends React.Component {
    constructor(props) {
        super(props);
        // refrences the (This) current instance of the class
        this.handleResp = this.handleResp.bind(this);
    }

    handleResp(res) {
        // console.log(res);
        const data = JSON.parse(res?.data[0]?.features);

        console.log(data);
        // removes the old click result if this.ID exist(container opened) remove the container
        this.id && this.props.removeMapClickResult(this.id);
        // saves the single click state in currentClick
        const currentClick = this.props.singleClick;
        // using the showMapClickResult and passing it the things that we want it to show in the container
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
    // prevProps => saving the old props before the change
    componentDidUpdate(prevProps) {
        //isActive => checking if the button is on or off
        if (this.props.isActive) {
            //destructing the layer that will be needed in the the callQueryService Function
            const { ganoushLayer } = this.props.settings.dataSettings;
            const prevClick = prevProps.singleClick;
            const currentClick = this.props.singleClick;
            //creating turf point and checking that the current click exitst
            const point =
                currentClick &&
                turf.point([
                    currentClick?.coordinate?.[0],
                    currentClick?.coordinate?.[1],
                ]);
            //creating turf buffer and checking that the point exists
            const buffer =
                point && turf.buffer(point, 0.3, { units: "kilometers" });
            if (currentClick && currentClick != prevClick && buffer) {
                //drawing the feature on the map in the shape of a buffer with the style options entered
                drawFeautres([buffer], {
                    vectorLayerOptions: { clear: true },
                    styleOptions: {
                        color: "#f00000A0",
                    },
                });
                // calling the callQueryService function that sends that request to the dataBase to get back the features needed
                callQueryService(ganoushLayer, this.handleResp, buffer);
            }
        }
    }

    render() {
        //why are we returning null?
        // we don't need to return anything since we are not changing the UI, we do it from MnA not from coding
        return null;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        // getting the singleClick selector and storing in the props
        singleClick: selectorsRegistry.getSelector(
            "selectMapSingleClick",
            state,
            ownProps.reducerId
        ),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // getting the showComponent functionality and storing in the props
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
        // getting the removeComponent functionality and saving it to the props
        removeMapClickResult: (id) =>
            dispatch(actionsRegistry.getActionCreator("removeComponent", id)),

        /* notify: (message, type) => {
            dispatch(
                systemAddNotification({
                    message,
                    type,
                })
            );
        }, */
    };
};

// connecting the states and dispatched to the desired component
export default connect(mapStateToProps, mapDispatchToProps)(MapClickComponent);
