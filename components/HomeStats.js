import axios from "axios";
import { useEffect, useState } from "react";
import { set, subHours } from "date-fns";
import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

export default function HomeStats() {
    const [orders, setOrders] = useState([])
    const [orderDetail, setOrderDetail] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const months = monthNames[new Date().getMonth()]
    const years = new Date().getFullYear()

    // useEffect(() => {
    //     setIsLoading(true);
    //     axios.get('/api/orders').then(res => {
    //         setOrders(res.data.filter(order => {
    //             return order.paid === true
    //         }));
    //         axios.get('/api/orderdetails').then(res => {
    //             setOrderDetail(res.data.filter(od => {
    //                 return od.order.paid === true
    //             }));
    //         })
    //         setIsLoading(false);
    //     });
    // }, []);

    function monthDataForCurrentYear(month) {
        const data = orderDetail.filter(o => {
            const currentDate = new Date();
            const orderDate = new Date(o.createdAt)
            const currentYear = currentDate.getFullYear()
            const currentMonth = month
            const isMonth = orderDate.getMonth() === currentMonth
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
            const isWithinDays = orderDate.getDate() >= 1 && orderDate.getDate() <= daysInMonth
            return isMonth && isWithinDays
        })
        return data
    }

    function ordersTotal(orderDetail) {
        // console.log(orderDetail)
        let sum = 0
        orderDetail.forEach(order => {
            const { line_items } = order
            line_items.forEach(li => {
                const lineSum = li.quantity * li.price_data.unit_amount
                sum += lineSum
            })
        });
        return sum
    }

    let datasets = []
    for (let i = 0; i <= (new Date().getMonth()); i++) {
        datasets.push(ordersTotal(monthDataForCurrentYear(i)))
    }

    ChartJS.register(
        LineElement,
        CategoryScale,
        LinearScale,
        PointElement,
        Legend,
        Tooltip,
        Title,
        Filler,
    )

    function roundUpToNearestMultiple(number, multiple) {
        let remainder = number % multiple;
        let roundedNumber;
        if (remainder >= (multiple / 2)) {
            roundedNumber = number + multiple - remainder;
        }
        else {
            roundedNumber = number;
        }
        return roundedNumber;
    }

    const max = roundUpToNearestMultiple(Math.max(...datasets), 5)
    const stepSize = max / 5;
    const data = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [{
            data: datasets,
            borderColor: 'rgba(0, 119, 290, 0.6)',
            fill: true,
            backgroundColor: 'rgba(0, 119, 290, 0.2)',
            pointBorderWidth: 4,
            tension: 0.5,
        }]
    }
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
            padding: {
                top: 20,
                bottom: 20,
            }
        },
        plugins: {
            title: {
                display: true,
                color: '#9ca3af',
                text: `Total Revenue for ${years}`,
                padding: {
                    top: 10,
                    bottom: 30,
                },
                font: {
                    size: 20,
                },
            },
            legend: {
                display: false,
            },
        },
        interaction: {
            mode: 'index',
            intersect: true,
        },
        scales: {
            x: {
                ticks: {
                    color: "#9ca3af",
                    padding: 10,
                    font: {
                        size: 15,
                    },
                },
                grid: {
                    display: false,
                }
            },
            y: {
                ticks: {
                    color: "#9ca3af",
                    padding: 10,
                    font: {
                        size: 15,
                    },
                    stepSize: stepSize,
                    // stepSize: 10000,
                    // callback: (value) => value + 'K'
                },
                border: {
                    dash: [10]
                },
                stacked: true,
            },
        }
    }

    if (isLoading) {
        return (
            <div className="my-4">
                {/* <Spinner fullWidth={true} /> */}
            </div>
        );
    }

    const ordersToday = orderDetail.filter(o => {
        const orderDate = new Date(o.createdAt)
        const currentDate = new Date()
        const isToday = orderDate.toDateString() === currentDate.toDateString()
        const isAfterMidnight = orderDate.getHours() >= 0
        return isToday && isAfterMidnight
    })
    const ordersWeek = orderDetail.filter(o => new Date(o.createdAt) > subHours(new Date, 24 * 7));
    const ordersMonth = monthDataForCurrentYear(new Date().getMonth())

    return (
        <div>
            <h2 className="text-[#111827] dark:text-white text-xl py-2">Order</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">{ordersToday.length}</div>
                    <div className="tile-desc">{ordersToday.length} orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Weekly</h3>
                    <div className="tile-number">{ordersWeek.length}</div>
                    <div className="tile-desc">{ordersWeek.length} orders after 7 days</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This month ({months})</h3>
                    <div className="tile-number">{ordersMonth.length}</div>
                    <div className="tile-desc">{ordersMonth.length} orders this month ({months})</div>
                </div>
            </div>
            <h2 className="text-[#111827] dark:text-white text-xl py-2">Revenue</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number"><span className="text-2xl">đ</span>{ordersTotal(ordersToday).toLocaleString()}</div>
                    <div className="tile-desc">{ordersToday.length} orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Weekly</h3>
                    <div className="tile-number"><span className="text-2xl">đ</span>{ordersTotal(ordersWeek).toLocaleString()}</div>
                    <div className="tile-desc">{ordersWeek.length} orders after 7 days</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This month ({months})</h3>
                    <div className="tile-number"><span className="text-2xl">đ</span>{ordersTotal(monthDataForCurrentYear(new Date().getMonth())).toLocaleString()}</div>
                    <div className="tile-desc">{ordersMonth.length} orders this month ({months})</div>
                </div>
            </div>
            <h2 className="text-[#111827] dark:text-white text-xl py-2 ">Chart</h2>
            <div className="h-[400px] w-auto md:h-[525px]">
                <Line className="border border-[#4b5563] p-5 rounded-md bg-white dark:bg-[#1f2938]" data={data} options={options}></Line>
            </div>
        </div>
    )
}