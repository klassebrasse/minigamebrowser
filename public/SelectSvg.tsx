function SelectSvg() {
    return(

        <svg width="100%" height="100%" version="1.0"
             xmlns="http://www.w3.org/2000/svg"
             xmlnsXlink="http://www.w3.org/1999/xlink">


            <defs>


                <svg className='head input-source' id='right'
                     height="100%"
                     width='100%'
                     viewBox="0 0 15 30"
                     preserveAspectRatio="xMaxYMid"
                >
                    <rect width="100%" height="100%"/>
                </svg>


                <svg className='head input-source' id='left'
                     height="100%"
                     width='100%'
                     viewBox="0 0 15 30"
                     preserveAspectRatio="xMinYMid"
                >
                    <rect width="100%" height="100%"/>
                </svg>

            </defs>

            <svg
                className='input-source'
                stroke='black'
                strokeWidth='0'
                fill="green">
                <rect x="2" y="20%" width="100%" height="60%"
                      stroke='black'
                      strokeWidth='0'
                >
                </rect>
                <use xlinkHref='#right'/>
                <use xlinkHref='#left'/>
            </svg>
        </svg>
    )
}

export default SelectSvg;