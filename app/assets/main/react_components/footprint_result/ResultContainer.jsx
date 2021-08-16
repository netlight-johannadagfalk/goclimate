import React from 'react';
import SignUpContainer from './SignUpContainer.jsx';

/**
 * React container for Result page components
 */
const ResultContainer = () => {
    console.log("ResultContainer render")

    return (
        <div className="pr-16">
            <div className="relative pb-1">
                <div className="space-y-6">

                    <SignUpContainer></SignUpContainer>

                </div>
            </div>
        </div>
    )
}

export default ResultContainer;
