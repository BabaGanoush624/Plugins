import React from 'react';

import { withLocalize } from '@penta-b/ma-lib';

import { LOCALIZATION_NAMESPACE } from '../../constants/constants';

class MapClickResult extends React.Component {
    render() {
        const { coordinate, t } = this.props;

        return (
            <div>
                {
                    t('click.msg', {
                        '0': coordinate[0],
                        '1': coordinate[1]
                    })
                }
                <br />
                {
                    t('test.plurals', {
                        '0': 1,
                        '1': 5
                    })
                }
            </div>
        );
    }
}

export default withLocalize(MapClickResult, LOCALIZATION_NAMESPACE);