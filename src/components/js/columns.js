import {format} from 'date-fns'
// TODO complete tool tips
export const COLUMNS = [
    {
        Header:'Date/Time',
        accessor: 'dateTime',
        Cell: ({value}) => {return format(new Date(value), 'dd/MM/yyyy HH:mm')},
    },
    {
        Header:'Details',
        accessor: 'details',
    },
    {
        Header:'Bet Market',
        accessor: 'betMarket',
        Cell: ({value}) => {return (String(betMarketMap.get(value)) || value)},
    },
    {
        Header:'Bet Outcome',
        accessor: 'betOutcome',
        toolTipText: 'The outcome that you should bet on.\nFor example, if:\n\tDetails = Arsenal vs Man Utd\n\tBet Market = Winner (90 mins)\n\tBet Outcome = AWAY\nThen you must back AND lay for Man Utd to win.' 
    },
    {
        id: 'normalRating',
        Header:'Rating (%)',
        accessor: 'normalBetRating',
        sortMethod: (a, b) => Number(a)-Number(b),
        toolTipText: 'The percentage of the back stake that you are guaranteed to receive if you back AND lay the bet correctly.\nFor example, if:\n\tBack stake = £10\n\tRating = 90%\nThen after both bets complete, you will have £9 returned to you (a loss of £1).\nHowever, you will have completed a qualifying bet which should allow you to access some profit-generating offer!\nYou want the rating to be as high as possible to minimise losses/maximise gains so click this column heading to sort!'
    },
    {
        id: 'snrRating',
        Header:'SNR Rating (%)',
        accessor: 'snrBetRating',
        sortMethod: (a, b) => Number(a)-Number(b),
        toolTipText: 'A SNR (stake not returned) bet is the most common type of free bet that a bookmaker will give to you.\nSNR means that your back stake is not returned if you win the bet.\nFor example, if\n\tBack stake = £10\n\tBack odds = 2.00\nThen, if your back bet wins, you will have £10 returned to you (normally you would receive £20, because the winnings includes your back stake).\nThe SNR Rating is a percentage of the back stake that you are guaranteed to receive if you back AND lay the bet correctly.\nYou want the rating to be as high as possible to minimise losses/maximise gains so click this column heading to sort!'
    },
    {
        Header:'Bookmaker',
        accessor: 'bookmakerWebLink',
        Cell: genBookmakerExchangeCell,
    },
    {
        Header:'Back',
        accessor: 'backOdds',
        sortMethod: (a, b) => Number(a)-Number(b),
        className: 'backOddsColumn',
    },
    {
        Header:'Exchange',
        accessor: 'exchangeWebLink',
        Cell: genBookmakerExchangeCell,
    },
    {
        Header:'Lay',
        accessor: 'layOdds',
        sortMethod: (a, b) => Number(a)-Number(b),
        className: 'layOddsColumn',
    },
    {
        Header:'Liquidity',
        accessor: 'liquidity',
        sortMethod: (a, b) => Number(a)-Number(b),
        toolTipText: 'Liquidity is the maximum amount of money available for you to place your lay bet on the betting exchange.',
    },
]

function genBookmakerExchangeCell({value}) {
    let domain = (new URL(value)).hostname;
    return (<a href={value}>{websiteMap.get(domain)}</a>);
}

// Maps ENUM keys from backend to user-friendly bet market string
var betMarketMap = new Map();
betMarketMap.set('WINNER_90_MINUTES', 'Winner (90 mins)');

// Maps website domains to user-friendly bookmaker/exchange string
var websiteMap = new Map();
websiteMap.set('www.betfair.com', 'Betfair');
websiteMap.set('sports.williamhill.com', 'William Hill');