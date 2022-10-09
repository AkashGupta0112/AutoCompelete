import React, { useState } from 'react';
import "./index.css";

function AutoComplete  (props)  {

    const { minLength = 2, dataSource, value, options, labelKey = "", hanlder, id = "", placeholder, name } = props;
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value || "");
    const [listoptions, setListOptions] = React.useState(options || []);
    const [loading, setLoading] = React.useState(false);
    const [focusIndex, setFocusIndex] = useState(0);
    let listRef = React.useRef();
    let listContainer = React.useRef(null);
    let SearchValue = inputValue.trim().length;

    React.useEffect(() => {
        
        let handlerListClose = (e) => {
            if (!listRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handlerListClose);
        return () => {
            document.removeEventListener('mousedown', handlerListClose)
        }
    }, []);

  

    React.useEffect(() => {
        if (!listContainer.current) return;
        listContainer.current.scrollIntoView({ block: "center", });
    }, [focusIndex]);

    const SearchInput = async (e) => {
        var value = e.target.value;
        if (value === "") {
            setOpen(false);
            setListOptions([]);
            setFocusIndex(-1);
        }
        setInputValue(value);
        if (dataSource) {
        if (value.trim().length >= parseInt(minLength)) {
            setLoading(true);
           
                var result = await dataSource(value);
            setListOptions(result);
            setOpen(true);
            }
        }

        if (options) {
            var result = options.filter(it => it[labelKey].includes(value));
            setListOptions(result);
            setOpen(true);
        }
        
       
        setLoading(false);
    }
    const clearInput = () => {
        setInputValue("");
        setListOptions([]);
        setOpen(false);
        hanlder([]);
    }
    const optionHandler = (value) => {
        var listoption = listoptions[value];
        setInputValue(listoption[labelKey]);
        setOpen(false);
        setFocusIndex(-1);
        hanlder(listoption);
    }

    const handleKeyDown = (e) => {
        const { key } = e;

        let nextIndexCount = 0;

        if (key === "ArrowDown") {
            nextIndexCount = (focusIndex + 1) % listoptions.length;
        }

        if (key === "ArrowUp") {
            nextIndexCount = (focusIndex + listoptions.length - 1) % listoptions.length;
        }

        if (key === "Escape") {

        }
        if (key === "Enter") {
            optionHandler(focusIndex);
        }

        if (key === "Tab") {
            optionHandler(focusIndex);
        }
        setFocusIndex(nextIndexCount);

    }
    return (
        <>

            <div className="dropdown-head" style={{ position: "relative", width: "500px" }} tabIndex={1} onKeyDown={handleKeyDown}>
                <input
                    placeholder={placeholder}
                    name={name}
                    id={id}
                    value={inputValue}
                    className="dropdown-input"
                    onChange={SearchInput}
                    title={inputValue}
                />
                {
                    loading &&
                    <div className="dropdown-loader-main">
                        <div className="dropdown-loader-sub">
                        </div>
                    </div>
                }
                {
                    (!loading && inputValue !== "")
                    &&
                    <div className="dropdown-cancel" onClick={clearInput}>
                    </div>
                }

                <div className="dropdown-list-container" style={{ display: open ? 'block' : 'none' }} ref={listRef}>
                    <ul className="dropdown-list-ul" >

                        {
                            listoptions.length !== 0
                                ?
                                listoptions.map((it, index) => { return <li id="test" key={index} className={`dropdown-list-li  ${index === focusIndex ? 'active' : ''}  `} ref={index === focusIndex ? listContainer : null} onClick={() => optionHandler(index)}>{it[labelKey]}</li> })
                                :
                                (SearchValue >= parseInt(minLength) && <li style={{ textAlign: "center", fontSize: "15px", padding: "4px 8px" }}>No Option Found</li>)
                        }
                    </ul>
                </div>
            </div>



        </>
    );
};

export default AutoComplete;