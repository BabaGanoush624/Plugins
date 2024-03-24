/**
 * Author: Amr Samir
 * 
 * Description: 
 *  - An example of a plugin that listens to another 
 *    plugin's state changes (Map plugin), and log that state.
 */


import React from 'react';
import { connect } from 'react-redux';
import { selectorsRegistry, actionsRegistry } from '@penta-b/ma-lib';
import { callQueryService } from '../../services/queryService';
import { drawFeatures } from '../../services/mapUtils';


class MapClickComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Description: 
     *  - React lifecycle method, here we check for state changes.
     */

    componentDidMount() {
        console.log(this.props.settings);
        const { ganoushLayer } = this.props.settings.dataSettings;
        const { POINT_SHAPE, POINT_COLOR, POINT_IMAGE } = ganoushLayer[0]["basicSettings"];
        callQueryService(ganoushLayer).then(async (GEOJSONFeatures) => {
            if (!GEOJSONFeatures) return this.props.notify("ISSUE WITH REQUEST", "error");


            await drawFeatures(GEOJSONFeatures, {
                vectorLayerOptions: { clear: false },
                styleOptions: {
                    isFile: POINT_SHAPE === "img",
                    color: POINT_COLOR,
                    iconSrc: POINT_IMAGE,
                },
            });
        });
    }
    componentDidUpdate(prevProps) {

        if (this.props.isActive) {
            const prevClick = prevProps.singleClick;
            const currentClick = this.props.singleClick;

            if (currentClick && currentClick != prevClick) {
                this.id && this.props.removeMapClickResult(this.id);

                this.props.showMapClickResult({
                    coordinate: currentClick.coordinate
                }, id => this.id = id);
            }
        }
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        singleClick: selectorsRegistry.getSelector('selectMapSingleClick', state, ownProps.reducerId)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showMapClickResult: (props, onAdd) => dispatch(actionsRegistry.getActionCreator('showComponent', 'ma-plugin-ganoushPlugin', 'ganoushIdentifierTable', props, onAdd)),
        removeMapClickResult: (id) => dispatch(actionsRegistry.getActionCreator('removeComponent', id)),
        notify: (message, type) => {
            dispatch(
                systemAddNotification({
                    message,
                    type,
                })
            );
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapClickComponent);