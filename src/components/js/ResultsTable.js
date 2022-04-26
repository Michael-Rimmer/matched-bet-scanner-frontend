import React, { useMemo, useState, useEffect } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import axios from 'axios';
import MOCK_DATA from '../../example_data/MOCK_DATA.json'
import { COLUMNS } from './columns.js'
import FadeLoader from "react-spinners/FadeLoader";

import '../css/table.css'

export function ResultsTable() {

    const columns = useMemo(() => COLUMNS, []);
    // const data = useMemo(() => MOCK_DATA, []);
    const [tableLoading, setTableLoading] = useState(true);
    const initialState = { hiddenColumns: ['snrRating'] };
    const [normalBetRadioChecked, setNormalBetRadioChecked] = useState(true);
    const [backStakeInput, setBackStakeInput] = useState(0);
    const [exchangeCommissionInput, setExchangeCommissionInput] = useState(2);

    // Make API call to populate table data
    const [data, setData] = useState([]);
    useEffect(() => {
      (async () => {
        const result = await axios.get(
            "http://localhost:8080/matched-bets",
            { headers: {'Content-Type': 'application/json'}}
        ).catch(function (error) {
            console.log();
            alert('Failed to obtain data from backend API, please refresh page and try again. If it continues to fail then the backend server is probably down :(');
            setTableLoading(false);
        });
        setData(result.data);
        setTableLoading(false);
      })();
    }, []);
    // const data = useMemo(() => apiData, []); // can I memo data once its received from axios?

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        state,
        prepareRow,
        toggleHideColumn,
    } = useTable({
        columns: columns,
        data: data,
        initialState,
    },
        useSortBy,
        usePagination);

    const { pageIndex, pageSize } = state;

    function handleBetTypeChange(e) {
        const { value } = e.target;

        if (value === 'normal') {
            setNormalBetRadioChecked(true);
            toggleHideColumn('normalRating', false);
            toggleHideColumn('snrRating', true);
        } else {
            setNormalBetRadioChecked(false);
            toggleHideColumn('normalRating', true);
            toggleHideColumn('snrRating', false);
        }
    };

    // Unfortunately I do not know how to include columns that 
    // generate data on the front-end into the react-table
    // framework so these columns are simply react components
    function CustomTH() {
        return (
            <>
                <th className='breakerColumn'></th>
                <th title={'Lay stake is the amount of money you must lay on the event to obtain the predicted overall profit/loss.\nBefore placing the back bet, you must always ensure that there is sufficient liquidity for the lay bet (liquidity must be <= lay stake).\nOtherwise only part of your lay bet will be accepted at the exchange and you will be at risk of losing money!'}>Lay Stake</th>
                <th title='Liability is the amount of money you need in your betting exchange in order to cover your lay bet, if it loses.'>Liability</th>
                <th>Overall Profit/Loss</th>
            </>
        );
    }

    function CustomTD({ row, backStake }) {

        function calcLayStake(row) {
            if (exchangeCommissionInput === 0 || backStakeInput === 0) {
                // short circuit
                return 0;
            }

            let backOdds = row.values.backOdds;
            let layOdds = row.values.layOdds;
            let optimalLayStake = 0;

            if (normalBetRadioChecked) {
                optimalLayStake = Math.round(backOdds / (layOdds - (exchangeCommissionInput / 100)) * backStakeInput * 100) / 100;
            } else {
                optimalLayStake = Math.round((backOdds - 1) / (layOdds - (exchangeCommissionInput / 100)) * backStakeInput * 100) / 100;
            }

            return optimalLayStake;
        }

        function genLayStakeCell(layStake) {
            if (row.values.liquidity < layStake) {
                return (
                    <td className='layStakeColumn' title='Be careful if using this bet - there may not be sufficient liquidity for this lay stake amount.'>{layStake}<span className='warning'> &#9888;</span></td>
                );
            } else {
                return <td className='layStakeColumn'>{layStake}</td>;
            }
        }

        function genLiabilityCell(row, layStake) {
            
            const liability = Math.round((layStake * (row.values.layOdds - 1)) * 100) / 100;
            return <td>{liability}</td>;
        }

        function displayLiquidityWarning(e) {
            console.log('display liquidity warning');
        }

        function genOverallProfitCell(row, backStake, layStake) {

            let profitIfBackBetWins = 0;
            let profitIfLayBetWins = 0;

            profitIfBackBetWins = (row.values.backOdds - 1) * backStake - (row.values.layOdds - 1) * layStake;

            if (normalBetRadioChecked) {
                profitIfLayBetWins = layStake * (1 - (exchangeCommissionInput / 100)) - backStake;
            } else {
                profitIfLayBetWins = layStake * (1 - (exchangeCommissionInput / 100));
            }

            const overallProfit = Math.round(((profitIfBackBetWins + profitIfLayBetWins) / 2) * 100) / 100;

            var classVar = '';
            if (overallProfit > 0) {
                classVar = 'positiveValue';
            } else if (overallProfit < 0) {
                classVar = 'negativeValue';
            }
            return (<td><span className={classVar}>{overallProfit}</span></td>);
        }

        let layStake = calcLayStake(row);
        return (
            <>
                {genLayStakeCell(layStake)}
                {genLiabilityCell(row, layStake)}
                {genOverallProfitCell(row, backStake, layStake)}
            </>
        )
    }

    return (
        <>
            <div id='userInput'>
                <label htmlFor='normalBetRadio'>Normal Bet </label>

                <input type='radio' id='normalBetRadio' name='betType' value='normal' onChange={handleBetTypeChange} checked={normalBetRadioChecked} />
                <br />
                <label htmlFor='snrBetRadio'>SNR Bet</label>
                <input type='radio' id='snrBetRadio' name='betType' value='snr' onChange={handleBetTypeChange} checked={!normalBetRadioChecked} />
                <br />
                <label htmlFor='backStakeInput'>Back stake £</label>
                <input type='number' id='backStakeInput' min='0' value={backStakeInput} onChange={(e) => { setBackStakeInput(e.target.value) }} />
                <br />
                <label htmlFor='exchangeCommissionInput'>Exchange Commision (%)</label>
                <input type='number' id='exchangeCommissionInput' min='0' max='100' value={exchangeCommissionInput} onChange={(e) => { setExchangeCommissionInput(e.target.value) }} />
            </div>
            <div>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                    {' '}
                </span>
                <span>
                    | Go to page: {' '}
                    <input
                        type='number'
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(pageNumber)
                        }}
                        min='1'
                        max={pageCount}
                        style={{ width: '40px' }}
                    />
                </span>
                <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                    {
                        [10, 25, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>Show {pageSize}</option>
                        ))
                    }
                </select>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
            </div>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => {
                        return (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column, index) => {
                                    return (
                                        <th
                                            {...column.getHeaderProps([
                                                column.getSortByToggleProps(),
                                                {
                                                    title: headerGroup.headers[index].toolTipText || 'Click to toggle sort.',
                                                },
                                            ])}
                                        >
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                                            </span>
                                        </th>
                                    );
                                })}
                                <CustomTH />
                            </tr>
                        );
                    })}
                </thead>
                <div id='tableLoaderContainer'>
                <FadeLoader color={'#b8b8b8'} speedMultiplier={0.8} height={25} width={25} radius={99} margin={50} loading={tableLoading} size={150}></FadeLoader>
                </div>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (<td
                                        {...cell.getCellProps([
                                            {
                                                className: cell.column.className
                                            }
                                        ])}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                    )
                                })}
                                {/* Columns generated by user input */}
                                <td className='breakerColumn'></td>
                                <CustomTD row={row} backStake={backStakeInput} />
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    );
}