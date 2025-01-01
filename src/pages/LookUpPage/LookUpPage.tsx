import React, { memo } from 'react';
import ToeicScorePage from '../../components/User/ToeicScoreTable/ToeicScoreTable';



const LookUpPage = () => {

    return (
        <React.Fragment>
            <ToeicScorePage />

        </React.Fragment>
    )
};

// Using React.memo to prevent re-render if props don't change
export default memo(LookUpPage);
