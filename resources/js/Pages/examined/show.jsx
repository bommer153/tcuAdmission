import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import * as XLSX from 'xlsx/xlsx.mjs';

export default function Reports({ auth, errors, applicantResultExam }) {
    console.log(applicantResultExam)
    const { data, setData } = useForm({
        date: "",
        time: "",
        room: "",
    })

    const { data: counts, setData: setCounts } = useForm({
        count: ""
    })

    const trackCount = applicantResultExam.length;

    const handleExcel = () => {

        const wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(applicantResultExam);

        XLSX.utils.book_append_sheet(wb, ws, "ExamResult");

        XLSX.writeFile(wb, `AdmissionTCU(2025-2026).xlsx`);
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Examined Result</h2>}
        >
            <Head title="Examined Results" />

            <div className=" p-5 px-20">

                <table cellspacing="0" cellpadding="4" className='bg-white'>
                    <tr>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>#</th>
                        <th style={{ width: '20%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Name</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Contact no.</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Overall</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Exam (60%)</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>GWA (40%)</th>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>G11 GWA 1</th>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>G11 GWA 2</th>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>G12 GWA 1</th>
                        <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>G12 GWA 2</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Schedule</th>
                        <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'gray', color: 'white', }}>Encoder (Scorer)</th>
                    </tr>



                    {applicantResultExam.map((applicant, index) => (
                        <tr key={applicant.id}>
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '8px' }}>{index + 1}</th>
                            <th style={{ width: '20%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.name}</th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.contact_no}</th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{Number(applicant.overall).toFixed(2)}</th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>({applicant.final_exam_score.toFixed(2)}) {applicant.exam_score}</th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{Number(applicant.gwascore).toFixed(2)}</th>
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.g11_gwa1}</th>
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.g11_gwa2}</th>
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.g12_gwa1}</th>
                            <th style={{ width: '5%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.g12_gwa2}</th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>
                                {applicant.exam_date + "-" + applicant.exam_time + "-Rm." + applicant.exam_room_no + "-St.no." + applicant.exam_seat_no}
                            </th>
                            <th style={{ width: '10%', border: '1px solid black', textAlign: 'center', fontSize: '10px' }}>{applicant.scorer_name}</th>

                        </tr>
                    ))}



                </table >
            </div >

        </AuthenticatedLayout >
    );
}
