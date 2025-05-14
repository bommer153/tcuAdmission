import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import * as XLSX from 'xlsx/xlsx.mjs';

export default function Reports({ auth, errors, examDates, examTimes, examRooms, queryParams = null, applicantResultExam }) {
    queryParams = queryParams || {}

    console.log(queryParams)

    const trackCount = applicantResultExam.length;

    const handleExcel = () => {

        const wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(applicantResultExam);

        XLSX.utils.book_append_sheet(wb, ws, "ExamResult");

        XLSX.writeFile(wb, `AdmissionTCU(2025-2026).xlsx`);
    };


    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value
        } else {
            delete queryParams[name]
        }

        router.get(route('examined.result'), queryParams);
    }

    const examScoreConflictCount = applicantResultExam.filter(applicant => applicant.exam_score <= 0).length;
    const gwaScoreConflictCount = applicantResultExam.filter(applicant => applicant.gwascore <= 30).length;

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Examined Result</h2>}
        >
            <Head title="Examined Results" />

            <div className="py-12">
                <div className="grid grid-cols-2 px-10">
                    <div className="px-5">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <form className="grid grid-cols-3">
                                    <div>
                                        <InputLabel htmlFor="date" value="Date" />

                                        <SelectInput
                                            className="mt-1 block w-full"
                                            defaultValue={queryParams.exam_date}
                                            onChange={e => searchFieldChanged('exam_date', e.target.value)}
                                        >
                                            <option value="">--SELECT DATE--</option>
                                            {examDates.map((examDate) => (
                                                <option key={examDate.id} value={examDate.exam_date}>{examDate.exam_date}</option>
                                            ))}
                                        </SelectInput>

                                    </div>

                                    <div className="ml-3">
                                        <InputLabel htmlFor="time" value="Shift" />
                                        <SelectInput
                                            className="mt-1 block w-full"
                                            name="examTime"
                                            defaultValue={queryParams.exam_time}
                                            onChange={e => searchFieldChanged('exam_time', e.target.value)}
                                        >
                                            <option value="">--SELECT TIME--</option>
                                            {examTimes.map((examTime) => (
                                                <option key={examTime.id} value={examTime.exam_time}>{examTime.exam_time}</option>
                                            ))}
                                        </SelectInput>
                                    </div>

                                    <div className="ml-3">
                                        <InputLabel htmlFor="room" value="Room" />

                                        <SelectInput
                                            name="examTime"
                                            className="mt-1 block w-full"
                                            defaultValue={queryParams.exam_room_no}
                                            onChange={e => searchFieldChanged('exam_room_no', e.target.value)}
                                        >
                                            <option value="">--SELECT EXAM ROOM--</option>
                                            {examRooms.map((examRoom) => (
                                                <option key={examRoom.id} value={examRoom.room_no}>{examRoom.room_no}</option>
                                            ))}
                                        </SelectInput>

                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className=" p-5 px-20">
                <div className='bg-white pl-2'>
                    {queryParams.exam_date && (<> Date: <u>{queryParams.exam_date}</u> </>)}
                    {queryParams.exam_time && (<> Time: <u>{queryParams.exam_time}</u> </>)}
                    {queryParams.exam_room_no && (<> Room: <u>{queryParams.exam_room_no}</u> </>)}
                    Count: <u>{trackCount}</u>

                </div>
                <div className='bg-white pl-2 text-[12px]'>
                    <p>Aplicants with 0 Exam Score: <u>&nbsp;&nbsp;{examScoreConflictCount}&nbsp;&nbsp;</u> </p>
                    <p>Possible Conflict at GWA: <u>&nbsp;&nbsp;{gwaScoreConflictCount}&nbsp;&nbsp;</u></p>
                </div>

                <table cellspacing="0" cellpadding="4" className='bg-white'>
                    <tr>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>#</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Name</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Contact no.</th>

                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Overall</th>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Exam (60%)</th>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>GWA (40%)</th>

                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>G11 GWA 1</th>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>G11 GWA 2</th>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>G12 GWA 1</th>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>G12 GWA 2</th>

                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Schedule</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Senior High School</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Encoder (Scorer)</th>
                    </tr>



                    {applicantResultExam.map((applicant, index) => (
                        <tr key={applicant.id}>
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '8px' }}>{index + 1}</th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.name}</th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.contact_no}</th>

                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{Number(applicant.overall).toFixed(2)}</th>
                            {applicant.exam_score > 0 ?
                                <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>({applicant.final_exam_score.toFixed(2)}) {applicant.exam_score}</th>
                                :
                                <th style={{ width: '5%', border: '1px solid black', background: 'red', textAlign: 'center', fontSize: '10px' }} title="0 EXAM GRADE">({applicant.final_exam_score.toFixed(2)}) {applicant.exam_score}</th>
                            }
                            {applicant.gwascore >= 30 ?
                                <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{Number(applicant.gwascore).toFixed(2)}</th>
                                :
                                <th style={{ width: '10%', border: '1px solid black', background: 'red', textAlign: 'center', fontSize: '10px' }}
                                    title="POSSIBLE GWA CONFLICT"
                                >{Number(applicant.gwascore).toFixed(2)}</th>
                            }

                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.g11_gwa1}</th>
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.g11_gwa2}</th>
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.g12_gwa1}</th>
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.g12_gwa2}</th>

                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>
                                {
                                    <>
                                        {applicant.exam_date} <br />
                                        {applicant.exam_time}<br />
                                        Rm.{applicant.exam_room_no}<br />
                                        Seat.{applicant.exam_seat_no}
                                    </>
                                }
                            </th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.senior_high_school}</th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.scorer_name}</th>

                        </tr>
                    ))}



                </table >
            </div >

        </AuthenticatedLayout >
    );
}
