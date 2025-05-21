import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import * as XLSX from 'xlsx/xlsx.mjs';
import { faCircleUser, faDownload, faEye, faFile, faSortAsc, faSortDesc, faStar, faUser, faVolleyballBall } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function Reports({ auth, errors, examDates, examTimes, examRooms, applicantResultExam, queryParams = null }) {

    queryParams = queryParams || {};

    const { data, setData } = useForm({
        date: "",
        time: "",
        room: "",
    })

    const { data: counts, setData: setCounts } = useForm({
        count: ""
    })



    const [listAthleteState, setListAthleteState] = useState('ON');
    const [listALSState, setListALSState] = useState('ON');
    const [listALS, setListALS] = useState('OFF');
    const [listAthlete, setListAthlete] = useState('OFF');
    const [onlyGWAConflict, setOnlyGWAConflict] = useState('OFF');
    const [currentList, setCurrentList] = useState(applicantResultExam);

    const trackCount = currentList.length;

    const handleExcel = () => {

        const wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(currentList);

        XLSX.utils.book_append_sheet(wb, ws, "ExamResult");

        XLSX.writeFile(wb, `AdmissionTCU(2025-2026).xlsx`);
    };

    // Shared filter function
    const applyFilters = (
        athleteState,
        alsState,
        onlyAthlete,
        onlyALS,
        gwaConflict
    ) => {
        let filtered = applicantResultExam;

        if (gwaConflict === 'ON') {
            filtered = applicantResultExam.filter(applicant => applicant.gwascore <= 30 || applicant.gwascore > 100);
        } else if (onlyAthlete === 'ON') {
            filtered = applicantResultExam.filter(applicant => applicant.athlete === 'Yes');
        } else if (onlyALS === 'ON') {
            filtered = applicantResultExam.filter(applicant => applicant.applicantType === 'ALS');
        } else {
            if (athleteState === 'OFF') {
                filtered = filtered.filter(applicant => applicant.athlete !== 'Yes');
            }
            if (alsState === 'OFF') {
                filtered = filtered.filter(applicant => applicant.applicantType !== 'ALS');
            }
        }

        setCurrentList(filtered);
    };


    // Handlers
    // Toggle exclude-athletes filter
    const handleAthlete = () => {
        const newState = listAthleteState === 'ON' ? 'OFF' : 'ON';
        setListAthleteState(newState);
        setListAthlete('OFF');
        setListALS('OFF');
        setOnlyGWAConflict('OFF');
        applyFilters(newState, listALSState, 'OFF', 'OFF', 'OFF');
    };

    // Toggle exclude-ALS filter
    const handleALS = () => {
        const newState = listALSState === 'ON' ? 'OFF' : 'ON';
        setListALSState(newState);
        setListALS('OFF');
        setListAthlete('OFF');
        setOnlyGWAConflict('OFF');
        applyFilters(listAthleteState, newState, 'OFF', 'OFF', 'OFF');
    };

    // Toggle only ALS applicants
    const handleALSOnly = () => {
        const newState = listALS === 'OFF' ? 'ON' : 'OFF';
        setListALS(newState);
        if (newState === 'OFF') {
            setListAthleteState('ON');
            setListALSState('ON');
            setListAthlete('OFF');
            setOnlyGWAConflict('OFF');
            applyFilters('ON', 'ON', 'OFF', newState, 'OFF');
        } else {
            setListAthleteState('OFF');
            setListALSState('OFF');
            setListAthlete('OFF');
            setOnlyGWAConflict('OFF');
            applyFilters('OFF', 'OFF', 'OFF', newState, 'OFF');
        }
    };

    // Toggle only athlete applicants
    const handleAthleteOnly = () => {
        const newState = listAthlete === 'OFF' ? 'ON' : 'OFF';
        setListAthlete(newState);
        if (newState === 'OFF') {
            setListAthleteState('ON');
            setListALSState('ON');
            setListALS('OFF');
            setOnlyGWAConflict('OFF');
            applyFilters('ON', 'ON', newState, 'OFF', 'OFF');
        } else {
            setListAthleteState('OFF');
            setListALSState('OFF');
            setListALS('OFF');
            setOnlyGWAConflict('OFF');
            applyFilters('OFF', 'OFF', newState, 'OFF', 'OFF');
        }

    };

    // Toggle only GWA conflict applicants (gwascore <= 30)
    const handleOnlyGWAConflict = () => {
        const newState = onlyGWAConflict === 'OFF' ? 'ON' : 'OFF';
        setOnlyGWAConflict(newState);
        if (newState === 'OFF') {
            setListAthleteState('ON');
            setListALSState('ON');
            setListAthlete('OFF');
            setListALS('OFF');
            applyFilters('ON', 'ON', 'OFF', 'OFF', newState);
        } else {
            setListAthleteState('OFF');
            setListALSState('OFF');
            setListAthlete('OFF');
            setListALS('OFF');
            applyFilters('OFF', 'OFF', 'OFF', 'OFF', newState);
        }
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }

        router.get(route('reports.index', queryParams), {}, {
            preserveScroll: true
        });
    };


    const examScoreConflictCount = currentList.filter(applicant => applicant.exam_score <= 0).length;
    const gwaScoreConflictCount = currentList.filter(applicant => applicant.gwascore <= 30 || applicant.gwascore > 100).length;
    // console.log(currentList)
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Reports</h2>}
        >
            <Head title="Dashboard" />

            {auth.user.role == '1' && (
                <div className="py-12">
                    <div className="grid grid-cols-2 px-10">
                        <div className="px-5">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900 dark:text-gray-100">
                                    <form className="grid grid-cols-3">
                                        <div>
                                            <InputLabel htmlFor="date" value="Date" />
                                            <SelectInput
                                                id="date"
                                                name="examDate"
                                                value={data.date}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("date", e.target.value)}
                                            >
                                                <option>--SELECT DATE--</option>
                                                {examDates.map((examDate) => (
                                                    <option key={examDate.id} value={examDate.exam_date}>{examDate.exam_date}</option>
                                                ))}
                                            </SelectInput>
                                            <InputError message={errors.examDate} className="mt-2" />
                                        </div>

                                        <div className="ml-3">
                                            <InputLabel htmlFor="time" value="Shift" />
                                            <SelectInput
                                                id="time"
                                                name="examTime"
                                                value={data.time}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("time", e.target.value)}
                                            >
                                                <option>--SELECT TIME--</option>
                                                {examTimes.map((examTime) => (
                                                    <option key={examTime.id} value={examTime.exam_time}>{examTime.exam_time}</option>
                                                ))}
                                            </SelectInput>
                                            <InputError message={errors.examTime} className="mt-2" />
                                        </div>

                                        <div className="ml-3">
                                            <InputLabel htmlFor="room" value="Room" />
                                            <SelectInput
                                                id="room"
                                                name="room"
                                                value={data.room}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("room", e.target.value)}
                                            >
                                                <option>--SELECT EXAM ROOM--</option>
                                                {examRooms.map((examRoom) => (
                                                    <option key={examRoom.id} value={examRoom.room_no}>{examRoom.room_no}</option>
                                                ))}
                                            </SelectInput>
                                            <InputError message={errors.room} className="mt-2" />
                                        </div>
                                    </form>
                                    <div className="mt-5">
                                        <a href={route('pdf.seatRecord', { date: data.date, time: data.time, room: data.room })} target="_blank">
                                            <Button className="mr-3"> Seat Report </Button>
                                        </a>

                                        <a href={route('pdf.seatPlan', { date: data.date, time: data.time, room: data.room })} target="_blank">
                                            <Button className="mr-3"> Seat Plan </Button>
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="px-5">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900 dark:text-gray-100">
                                    <form>
                                        <div>
                                            <InputLabel htmlFor="count" value="Count" />
                                            <TextInput
                                                id="count"
                                                name="count"
                                                value={counts.count}
                                                type="number"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setCounts("count", e.target.value)}
                                            >
                                            </TextInput>
                                            <InputError message={errors.count} className="mt-2" />
                                        </div>

                                    </form>
                                    <div className="mt-5">
                                        <a href={route('pdf.result', { counts: counts.count })} target="_blank">
                                            <Button className="mr-3">Print Exam Result </Button>
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className=" p-5 px-20">

                <div className='mb-2 bg-white rounded p-4'>
                    {auth.user.role == '1' && (
                        <button
                            onClick={handleExcel}
                            className=' hover:underline'
                        >
                            <FontAwesomeIcon icon={faDownload} /> EXCEL DOWNLOAD
                        </button>
                    )}


                    <ul>
                        <li className='mt-2 text-gray-600'>

                            <FontAwesomeIcon className='text-gray-900' icon={faVolleyballBall} /> Athlete :

                            <button
                                onClick={handleAthlete}
                            >
                                {listAthleteState === "ON" ? (
                                    <span className="ml-2 bg-green-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-green-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listAthleteState}</span>
                                ) : (
                                    <span className="ml-2 bg-red-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-red-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listAthleteState}</span>
                                )}
                            </button>
                        </li>
                        <li className='mt-2 text-gray-600 mb-4'>
                            <FontAwesomeIcon className='text-gray-900' icon={faUser} /> ALS :

                            <button
                                onClick={handleALS}
                            >
                                {listALSState === "ON" ? (
                                    <span className="ml-2 bg-green-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-green-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listALSState}</span>
                                ) : (
                                    <span className="ml-2 bg-red-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-red-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listALSState}</span>
                                )}
                            </button>
                        </li>
                        <li className='mt-2 text-gray-600 ml-4'>

                            <FontAwesomeIcon className='text-gray-900' icon={faCircleUser} /> Only Athlete :
                            <button
                                onClick={handleAthleteOnly}
                            >
                                {listAthlete === "ON" ? (
                                    <span className="ml-2 bg-green-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-green-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listAthlete}</span>
                                ) : (
                                    <span className="ml-2 bg-red-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-red-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listAthlete}</span>
                                )}
                            </button>
                        </li>
                        <li className='mt-2 text-gray-600 ml-4'>
                            <FontAwesomeIcon className='text-gray-900' icon={faCircleUser} /> Only ALS :
                            <button
                                onClick={handleALSOnly}
                            >
                                {listALS === "ON" ? (
                                    <span className="ml-2 bg-green-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-green-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listALS}</span>
                                ) : (
                                    <span className="ml-2 bg-red-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-red-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listALS}</span>
                                )}
                            </button>
                        </li>
                        <li className='mt-2 text-gray-600 ml-4'>
                            <FontAwesomeIcon className='text-gray-900' icon={faCircleUser} /> Only GWA with Conflict (GWA &lt;= 30 or GWA &gt; 100) :
                            <button
                                onClick={handleOnlyGWAConflict}
                            >
                                {onlyGWAConflict === "ON" ? (
                                    <span className="ml-2 bg-green-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-green-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{onlyGWAConflict}</span>
                                ) : (
                                    <span className="ml-2 bg-red-500 text-gray-100 rounded p-1 shadow-md text-[11px] hover:bg-red-700"
                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{onlyGWAConflict}</span>
                                )}
                            </button>
                        </li>
                    </ul>

                    <div>
                        {/* put input here */}
                    </div>

                </div>
                <div className='bg-white pl-2 text-[12px]'>
                    <p>Count: <u>{trackCount}</u></p>
                    <p>Aplicants with 0 Exam Score: <u>&nbsp;&nbsp;{examScoreConflictCount}&nbsp;&nbsp;</u> </p>
                    <p>Conflict GWA (GWA &lt;= 30 or GWA &gt; 100) : <u>&nbsp;&nbsp;{gwaScoreConflictCount}&nbsp;&nbsp;</u></p>

                </div>
                <table cellSpacing="0" cellPadding="4" className='bg-white'>

                    <tr>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>#</th>
                        <th style={{ width: '20%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Name</th>
                        <th
                            onClick={e => sortChanged('overall')}
                            className="w-[10%] border border-black text-center text-[14px] font-bold bg-gray-700 text-white"
                        >
                            <div className="flex items-center justify-center">
                                <span className="mr-1">Overall</span>
                                <div className="flex flex-col items-center leading-[0]">
                                    <FontAwesomeIcon className={
                                        "w-3 h-3 " +
                                        (queryParams.sort_field === 'overall' && queryParams.sort_direction === 'asc' ? ' text-white ' : ' text-gray-500')
                                    } icon={faSortAsc} />
                                    <FontAwesomeIcon className={
                                        "w-3 h-3 -mt-[12px] " +
                                        (queryParams.sort_field === 'overall' && queryParams.sort_direction === 'desc' ? ' text-white ' : ' text-gray-500')
                                    } icon={faSortDesc} />
                                </div>

                            </div>
                        </th>
                        <th
                            onClick={e => sortChanged('exam_score')}
                            className="w-[10%] border border-black text-center text-[14px] font-bold bg-gray-700 text-white"
                        >
                            <div className="flex items-center justify-center">
                                <span className="mr-1">Exam (60%)</span>
                                <div className="flex flex-col items-center leading-[0]">
                                    <FontAwesomeIcon className={
                                        "w-3 h-3 " +
                                        (queryParams.sort_field === 'exam_score' && queryParams.sort_direction === 'asc' ? ' text-white ' : ' text-gray-500')
                                    } icon={faSortAsc} />
                                    <FontAwesomeIcon className={
                                        "w-3 h-3 -mt-[12px] " +
                                        (queryParams.sort_field === 'exam_score' && queryParams.sort_direction === 'desc' ? ' text-white ' : ' text-gray-500')
                                    } icon={faSortDesc} />
                                </div>

                            </div>

                        </th>
                        <th
                            onClick={e => sortChanged('gwascore')}
                            className="w-[10%] border border-black text-center text-[14px] font-bold bg-gray-700 text-white"
                        >
                            <div className="flex items-center justify-center">
                                <span className="mr-1">GWA (40%)</span>
                                <div className="flex flex-col items-center leading-[0]">
                                    <FontAwesomeIcon className={
                                        "w-3 h-3 " +
                                        (queryParams.sort_field === 'gwascore' && queryParams.sort_direction === 'asc' ? ' text-white ' : ' text-gray-500')
                                    } icon={faSortAsc} />
                                    <FontAwesomeIcon className={
                                        "w-3 h-3 -mt-[12px] " +
                                        (queryParams.sort_field === 'gwascore' && queryParams.sort_direction === 'desc' ? ' text-white ' : ' text-gray-500')
                                    } icon={faSortDesc} />
                                </div>

                            </div>
                            
                        </th>
                        <th style={{ width: '15%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>1st Choice</th>
                        <th style={{ width: '15%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>2nd Choice</th>
                        <th style={{ width: '15%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>3rd Choice</th>
                    </tr>



                    {currentList.map((applicant, index) => (

                        <tr
                            key={applicant.id}
                            className={applicant.athlete === 'Yes' ? 'bg-yellow-300' : ''}
                        >
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '8px' }}>{index + 1}</th>
                            <th style={{ width: '20%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.name} {
                                applicant.applicantType == "ALS" && <span className='p-1 bg-green-300 rounded'>ALS</span>}
                            </th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{Number(applicant.overall).toFixed(2)}</th>

                            {applicant.exam_score > 0 ?
                                <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>({applicant.final_exam_score}) {applicant.exam_score}</th>
                                :
                                <th style={{ width: '5%', border: '1px solid black', background: 'red', textAlign: 'center', fontSize: '10px' }} title="0 EXAM GRADE">({applicant.final_exam_score}) {applicant.exam_score}</th>
                            }
                            {(applicant.gwascore <= 30 || applicant.gwascore > 100) ?
                                <th style={{ width: '10%', border: '1px solid black', background: 'red', textAlign: 'center', fontSize: '10px' }}
                                    title="POSSIBLE GWA CONFLICT" >
                                    {Number(applicant.gwascore).toFixed(2)}
                                </th>
                                :
                                <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{Number(applicant.gwascore).toFixed(2)}</th>
                            }

                            <th style={{ width: '15%', border: '1px solid black', textAlign: 'center', fontSize: '9px' }}>{applicant.firstChoice}</th>
                            <th style={{ width: '15%', border: '1px solid black', textAlign: 'center', fontSize: '9px' }}>{applicant.secondChoice}</th>
                            <th style={{ width: '15%', border: '1px solid black', textAlign: 'center', fontSize: '9px' }}>{applicant.thirdChoice}</th>
                        </tr>
                    ))}


                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className=" text-right p-5">
                            {auth.user.role === '1' && (
                                <div>
                                    <b style={{ fontSize: '12px' }}>
                                        Total: {trackCount}
                                        <br /><br /><br />
                                        Engr. Ferdinand E. Rubio<br />
                                        MIS Director
                                    </b>
                                </div>
                            )}
                        </td>
                    </tr>
                </table >
            </div >

        </AuthenticatedLayout >
    );
}
