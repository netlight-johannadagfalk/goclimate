import React from 'react'

const ResultTitle = ({ title }) => {
    return (
        <div className="text-center pb-8 t:pb-16 d:pb-32 lg:px-0 max-w-4xl mx-auto">
            <h1 className="font-semibold text-xl t:text-2xl d-md:text-3xl my-5">{title}</h1>
        </div>
    )
}

export default ResultTitle
