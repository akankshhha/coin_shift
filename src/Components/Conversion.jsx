import { useState, useEffect } from "react";
import React from "react";
import Select from 'react-select';
import { fetchSupportedCodes, fetchCurrenciesBasedOnDate } from '../Services/apiService'
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Conversion = () => {
    const today = new Date()
    const defaultCurrency = 'USD'
    
    const [date, setDate] = useState(today)
    const [base, setBase] = useState(defaultCurrency)
    const [target, setTarget] = useState("")
    const [conversionRates, setConversionRates] = useState({})
    const [baseOptions, setBaseOptions] = useState([])
    const [targetOptions, setTargetOptions] = useState([])
    const [baseAmount, setBaseAmount] = useState(0)
    const [result, setResult] = useState(0)

    useEffect(() => {
        updateOptions();
        fetchCRBasedOnDate(base, date);
    }, []);

    //function to update options for both the base and the target currency dropdowns.
    const updateOptions = async () => {
        try {
            const availableOptions = await fetchSupportedCodes();
            const supportedCodes = availableOptions?.supported_codes
            let currencyOptions;

            currencyOptions = availableOptions?.supported_codes?.map(currency => ({
                value: currency[0],
                label: `${currency[1]} (${currency[0]})`,
            }));

            setBaseOptions(currencyOptions)
            setTargetOptions(currencyOptions)
            if (date < new Date('2020-12-31')) {
                //arranging for react select
                currencyOptions = supportedCodes.filter(currency => {
                    const currencyCode = currency[0];
                    return conversionRates.hasOwnProperty(currencyCode);
                }).map(currency => ({
                    value: currency[0],
                    label: `${currency[1]} (${currency[0]})`,
                }));
                setTargetOptions(currencyOptions)
                setBaseOptions(currencyOptions)
            }

        } catch (error) {
            console.log("Error fetching supported codes.")
        }
    }

    const fetchCRBasedOnDate = async (baseCurrency, chosenDate) => {
        const baseRates = await fetchCurrenciesBasedOnDate(baseCurrency, chosenDate)
        console.log('gettin called')
        if (baseRates) {
            console.log(baseRates["conversion_rates"])
            setConversionRates(baseRates["conversion_rates"])
        }

    }

    const dateChangeHandler = async (event) => {
        const chosenDate = new Date(event.target.value)
        setDate(chosenDate)
        await fetchCRBasedOnDate(base, chosenDate)
        setTarget('')
        setBase(defaultCurrency)
    }

    //function to calculate the total result
    const calculateResult = () => {
        if (!target) {
            toast.error('Please choose target currency!')
            return
        }
        if (baseAmount === 0 || baseAmount === '') {
            toast.error('Enter the amount in base currency!')
            return
        }
        let inputAmount = parseFloat(baseAmount)
        let resultAmount = inputAmount * conversionRates[target]
        setResult(resultAmount)
    }

    const selectionChangeBase = (selectedOption) => {
        setBase(selectedOption.value)
        fetchCRBasedOnDate(selectedOption.value, date);
    }

    const selectionChangeTarget = (selectedOption) => {
        setTarget(selectedOption.value)

    };

    const dropdownValue = (optionArray, dropdownType) => {
        const filteredOption = optionArray?.find((option) => option.value === dropdownType)

        if (filteredOption) {
            console.log(filteredOption)
            return filteredOption
        }
        return ''

    }

    const resetValues = () => {
        setBase(defaultCurrency)
        setTarget("")
        setBaseAmount(0)
        setResult(0)
        setDate(today)
    }

    const formatDate = (dateParam) => {
        return dateParam.toISOString().split('T')[0]
    }

    return (
        <div className="">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover
                theme="light"
            />
            <div className="d-flex section-1 justify-content-center m-4 align-items-center">
                <p className="mx-2 fw-bold my-0">Choose the date for which you need the exchange rates!</p>
                <input type="date" name="" id="" max={formatDate(today)} defaultValue={formatDate(date)} onChange={dateChangeHandler} className="mx-2" />

            </div>
            <div className="d-flex mt-5 mb-3 mx-5 justify-content-around">
                <div className="">
                    <label htmlFor="">Base Currency {base ? `(${base})` : ''}</label>
                    <Select
                        value={dropdownValue(baseOptions, base)}
                        onChange={selectionChangeBase}
                        options={baseOptions}
                        className="select-react my-2"
                        placeholder="Choose.."
                    />
                    <input type="number" id="baseAmount" placeholder={`Enter amount in ${base}`} className="py-1 ps-2 fs-6" value={baseAmount} onChange={(event) => setBaseAmount(event.target.value)} />

                </div>
                <div className="">
                    <label htmlFor="">Target Currency {target ? `(${target})` : ''}</label>
                    <Select
                        value={dropdownValue(targetOptions, target)}
                        onChange={selectionChangeTarget}
                        options={targetOptions}
                        className="select-react my-2"
                        placeholder="Choose.."
                    />
                    <span>{`${result.toFixed(3)} ${target}`}</span>
                </div>
            </div>
            <div className="text-center mb-3 fs-6"><button onClick={calculateResult} className="convert-btn mx-2">Convert</button><button onClick={resetValues} className="convert-btn mx-2">Reset</button></div>

        </div>
    )
}

export default Conversion