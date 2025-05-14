import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import React, { useState } from 'react';
import '../../css/app.css';
import * as XLSX from 'xlsx/xlsx.mjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard(props, queryParams = null) {

    const [myDates, setMyDates] = useState("");
    const [activeTab, setActiveTab] = useState('MAIN');
    const [visibleRows, setVisibleRows] = useState({});

    const [listAthleteState, setListAthleteState] = useState('ON');
    const [currentList, setCurrentList] = useState(props.athleteApplicant);

    queryParams = props.queryParams || {};
    console.log(props.olivarez);
    const onChange = (date) => {

        queryParams['date'] = date;
        setMyDates(date);
        router.get(route("dashboard"), queryParams, {
            preserveState: true, // Prevents full-page reload
        });

    };

    const toggleRowVisibility = (index) => {
        setVisibleRows((prevState) => ({
            ...prevState,
            [index]: !prevState[index], // Toggle visibility for the row
        }));
    };

    const handleExcel = () => {

        const athleteWithoutId = currentList.map(({
            id, name,
            firstChoice, secondChoice, thirdChoice,
            exam_score, overall, final_exam_score, gwascore,
            g11gwa1, g11gwa2, g12gwa1, g12gwa2, ...rest }, index) => {

            const NAME = name;
            const FCOURSE = firstChoice;
            const SCOURSE = secondChoice;
            const TCOURSE = thirdChoice;
            const SCORE = exam_score;
            const OVERALL = overall;
            const EXAM_SCORE = final_exam_score;
            const GWA = gwascore;
            const G11GWA1 = g11gwa1;
            const G11GWA2 = g11gwa2;
            const G12GWA1 = g12gwa1;
            const G12GWA2 = g12gwa2;


            return {
                ...rest,
                NO: index + 1,
                NAME: NAME,

                SCORE: SCORE,
                'OVERALL': OVERALL,
                'GWA (40%)': GWA,
                'EXAM (60%)': EXAM_SCORE,
                'G11 GWA 1': G11GWA1,
                'G11 GWA 2': G11GWA2,
                'G12 GWA 1': G12GWA1,
                'G12 GWA 2': G12GWA2,

                'FIRST COURSE': FCOURSE,
                'SECOND COURSE': SCOURSE,
                'THIRD COURSE': TCOURSE,

            };
        });


        const wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(athleteWithoutId);

        XLSX.utils.book_append_sheet(wb, ws, "AthleteList");

        XLSX.writeFile(wb, `Athlete-Admission-List(2025-2026).xlsx`);

    };

    const handleAthlete = () => {
        if (listAthleteState === 'ON') {
            setListAthleteState('OFF');
            setCurrentList(props.athleteApplicant.filter(applicant => applicant.overall >= 70));
        } else {
            setListAthleteState('ON');
            setCurrentList(props.athleteApplicant);
        }
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-4">
                {
                    <>
                        <div className="bg-white dark:bg-gray-900 shadow mb-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex space-x-4">
                                <button
                                    onClick={() => setActiveTab('MAIN')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'MAIN'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveTab('ATHLETE')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'ATHLETE'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Athlete Applicants
                                </button>
                            </div>
                        </div>


                        {activeTab === 'MAIN' && (
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8" id="MAIN">

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="grid grid-cols-4">
                                        <div></div>
                                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 float-right">
                                            <TextInput
                                                type="date"
                                                name="date"
                                                value={myDates}
                                                className="float-right"
                                                onChange={(e) => onChange(e.target.value)}
                                            />
                                        </div>
                                        {props.results && (
                                            <div className="w-[300px] mx-auto sm:px-6 lg:px-8 float-left">
                                                <div className="p-2 text-gray-900 dark:text-gray-100 bg-red-400 rounded ">
                                                    <b>Filtered Finish</b>:  {props.results}
                                                </div>
                                            </div>
                                        )}
                                        <div></div>
                                    </div>
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="grid grid-cols-3">
                                            <div className="col-span-2">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-auto">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white border-b-2 border-gray-500">

                                                        <tr>
                                                            <th className="px-3 py-2">Barangay</th>
                                                            <th className="px-3 py-2">Total</th>
                                                            <th className="px-3 py-2">With Permit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {props.barangays.map((barangay) => (
                                                            <tr key={barangay.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                                <td className="px-3 py-2">{barangay.barangay}</td>
                                                                <td className="px-3 py-2">{barangay.my_applicants?.length}</td>
                                                                <td className="px-3 py-2">{barangay.my_applicants_with_permit?.length}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="">
                                                <div className="bg-blue-500 rounded m-5 p-5">
                                                    Finish Today : {props.todaysFinish}
                                                </div>
                                                <div className="bg-red-600 rounded m-5 p-5">
                                                    Finished Applicant: {props.totalFinish}
                                                </div>
                                                <div className="bg-green-600 rounded m-5 p-5">
                                                    Total Applicant: {props.applicantTotal}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ATHLETE' && (
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8" id="ATHLETE">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        {props.auth.user.role == 1 &&
                                            <div>
                                                <button className='hover:text-blue-500' onClick={handleExcel}>
                                                    <FontAwesomeIcon icon={faDownload} /> EXCEL DOWNLOAD
                                                </button>
                                                <button
                                                    onClick={handleAthlete}
                                                    className='ml-4 text-white hover:underline'
                                                >
                                                    pass :
                                                </button>
                                                {listAthleteState === "ON" ? (
                                                    <span className="ml-2 bg-green-500 text-gray-100 rounded p-1 shadow-md"
                                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listAthleteState}</span>
                                                ) : (
                                                    <span className="ml-2 bg-red-500 text-gray-100 rounded p-1 shadow-md"
                                                        style={{ boxShadow: '0 2px 2px rgba(141, 136, 136, 0.5)' }}>{listAthleteState}</span>
                                                )}
                                            </div>
                                        }
                                        <div><b>TOTAL:</b> {currentList.length}</div>
                                        <table className="table-auto w-full">
                                            <thead>
                                                <tr>
                                                    <th className="border-b border-gray-300 px-4 py-2 text-left">#</th>
                                                    {props.auth.user.role == 1 && <th className="border-b border-gray-300 px-4 py-2 text-left">ID</th>}
                                                    <th className="border-b border-gray-300 px-4 py-2 text-left">Name</th>
                                                    <th className="border-b border-gray-300 px-4 py-2 text-left">Course Preferences</th>

                                                    <th className="border-b border-gray-300 px-4 py-2 text-left w-[80px] text-[9px]">Overall</th>
                                                    <th className="border-b border-gray-300 px-4 py-2 text-left w-[80px] text-[9px]">Exam (60%)</th>
                                                    <th className="border-b border-gray-300 px-4 py-2 text-left w-[80px] text-[9px]">GWA (40%)</th>

                                                    <th className="border-b border-gray-300 px-4 py-2 text-left w-[80px] text-[9px]">G11 GWA 1</th>
                                                    <th className="border-b border-gray-300 px-4 py-2 text-left w-[80px] text-[9px]">G11 GWA 2</th>
                                                    <th className="border-b border-gray-300 px-4 py-2 text-left w-[80px] text-[9px]">G12 GWA 1</th>
                                                    <th className="border-b border-gray-300 px-4 py-2 text-left w-[80px] text-[9px]">G12 GWA 2</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentList.map((athlete, index) => (

                                                    <tr key={index}>
                                                        <td className="border-b border-gray-700 px-2 py-0 text-gray-400">{index + 1}</td>
                                                        {props.auth.user.role == 1 && <td className="border-b border-gray-700 px-2 py-0 text-gray-400">{athlete.id}</td>}
                                                        <td className="border-b border-gray-700 px-2 py-0 text-gray-400  text-[12px]">
                                                            {athlete.name}
                                                        </td>
                                                        <td className="border-b border-gray-700 px-2 py-0 text-gray-400 w-[250px]">
                                                            <button
                                                                onClick={() => toggleRowVisibility(index)} // Toggle visibility for the entire row
                                                                className="text-blue-500 hover:underline text-sm"
                                                            >
                                                                {visibleRows[index] ? 'Hide Courses' : 'Show Courses'}
                                                            </button>

                                                            {/* Only show the row's contents when the row is visible */}
                                                            {visibleRows[index] && (
                                                                <div className="mt-2 text-[12px]">
                                                                    <ol className={`course-list ${visibleRows[index] ? 'show' : ''} list-decimal list-inside mt-1`}>
                                                                        {athlete.firstChoice && <li>{athlete.firstChoice}</li>}
                                                                        {athlete.secondChoice && <li>{athlete.secondChoice}</li>}
                                                                        {athlete.thirdChoice && <li>{athlete.thirdChoice}</li>}
                                                                    </ol>
                                                                </div>
                                                            )}
                                                        </td>
                                                        {athlete.overall >= 70 ?
                                                            <td className="border-b border-gray-700 bg-green-800 px-2 py-0 text-gray-200 text-[11px]">{athlete.overall}</td>
                                                            :
                                                            <td className="border-b border-gray-700 px-2 py-0 text-gray-400 text-[11px]">{athlete.overall}</td>
                                                        }
                                                        <td className="border-b border-gray-700 px-2 py-0 text-gray-400 text-[11px]">({athlete.final_exam_score}) {athlete.exam_score}</td>
                                                        <td className="border-b border-gray-700 px-2 py-0 text-gray-400 text-[11px]">{athlete.gwascore}</td>

                                                        <td className="border-b border-gray-700 px-2 py-0 text-gray-400 text-[11px]">{athlete.g11gwa1}</td>
                                                        <td className="border-b border-gray-700 px-2 py-0 text-gray-400 text-[11px]">{athlete.g11gwa2}</td>
                                                        <td className="border-b border-gray-700 px-2 py-0 text-gray-400 text-[11px]">{athlete.g12gwa1}</td>
                                                        <td className="border-b border-gray-700 px-2 py-0 text-gray-400 text-[11px]">{athlete.g12gwa2}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>




                                    </div>
                                </div>
                            </div>
                        )}


                    </>

                }










            </div>
        </AuthenticatedLayout>
    );
}
