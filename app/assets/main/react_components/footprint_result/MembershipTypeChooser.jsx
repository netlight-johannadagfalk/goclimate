import React from 'react';
import SelectorMultipleTimes from './SelectorMultipleTimes.jsx';

/**
 * React container for Sign up components
 */
const MembershipTypeChooser = () => {
    console.log("MembershipTypeChooser render")

    return (
        <form className="space-y-3" data-target="registrations--price.peopleForm" data-url="/users/sign_up" action="/users/sign_up" accept-charset="UTF-8" method="get">
            <input value="b3ec26a402c164dd2f8a78bf7e95841922cbb9bc" type="hidden" name="lifestyle_footprint" id="lifestyle_footprint"/>

            <label className="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
                data-active-class="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" 
                data-inactive-class="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
                htmlFor="free">
                <input className="flex-shrink-0 mr-2" type="radio" name="membership" id="free" value="free" 
                    data-target="registrations--membership-choice.choice" 
                    data-action="click->registrations--membership-choice#handleChange"/>
                <span><span className="font-bold">Free account</span>. Track your carbon footprint over time.</span>
            </label>
            <label className="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" 
                data-active-class="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" 
                data-inactive-class="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
                htmlFor="single">
                <input className="flex-shrink-0 mr-2" type="radio" name="membership" id="single" value="single" 
                    checked 
                    data-target="registrations--membership-choice.choice" 
                    data-action="click->registrations--membership-choice#handleChange"/>
                <span><span className="font-bold">Offset</span> your carbon footprint through climate projects.</span>
            </label>
            <label className="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
                data-active-class="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" 
                data-inactive-class="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
                htmlFor="multi">
                <input className="flex-shrink-0 mr-2" type="radio" name="membership" id="multi" value="multi" 
                    data-target="registrations--membership-choice.choice" 
                    data-action="click->registrations--membership-choice#handleChange"/>
                <span><span className="font-bold">Offset multiple times</span>. Offset more for yourself or for loved ones.</span>
                <div className="select-wrapper flex-shrink-0">
                <SelectorMultipleTimes/>
                </div>
            </label>
        </form>   

    )
}

export default MembershipTypeChooser;
