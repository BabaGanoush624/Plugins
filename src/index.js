/**
 * Author: Amr Samir
 * 
 * Description: 
 *  - This index file exports plugin's components and/or reducers and/or actions.
 */

import MapClick from './components/MapClick/MapClick.component';
import MapClickResult from './components/MapClickResult/MapClickResult.component';
import defaultLocalization from './messages';
import { LOCALIZATION_NAMESPACE } from './constants/constants';

MapClick.Title = LOCALIZATION_NAMESPACE + ":title";
MapClick.Icon = LOCALIZATION_NAMESPACE + ":icon";

const components = {
    ganoushIdentifierTrigger: MapClick,
    ganoushIdentifierTable: MapClickResult
};

const localization = {
    namespace: LOCALIZATION_NAMESPACE,
    defaultLocalization
}

export { components, localization };