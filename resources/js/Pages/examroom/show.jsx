import Button from '@/Components/Button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


export default function Show({ errors, auth, examRoom, examDate, examTime, leftwings, rightwings }) {



    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                <Link href={route('examroom.index')}><FontAwesomeIcon icon={faArrowLeft} /> </Link>

                Room: {examRoom.room_no}
            </h2>}
        >
            <Head title={examRoom.room_no} />

            <div className="py-12">

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-5">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg grid grid-cols-2">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1><span className="font-bold">Exam Date :</span> {examDate.exam_date}</h1>
                            <h1><span className="font-bold">Exam Time :</span> {examTime.exam_time}</h1>
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <a className="mr-4" href={route('pdf.seatRecord',{date:examDate.exam_date, time:examTime.exam_time, room:examRoom.room_no })} target="_blank">  
                                <Button>Seat Record</Button>
                            </a>   
                            <a href={route('pdf.seatPlan',{date:examDate.exam_date, time:examTime.exam_time, room:examRoom.room_no })} target="_blank">  
                                <Button>Seat Plan</Button>
                            </a>                          
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-2">

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mr-5">
                        <div className="p-6 text-gray-900 dark:text-gray-100 ">
                            <h2 className="font-bold text-3xl mb-5">Left Wing</h2>
                            <div className="grid grid-cols-5 shadow-sm sm:rounded">
                                {leftwings.map((leftwing,index) => (
                                    <Link href={route('examroom.seat', { examroom: examRoom.id, seat: leftwing.seatNo })} key={index}>
                                        <div className={`flex items-center justify-center mb-5 ml-5 sm:rounded-lg cursor-pointer h-20 ${
                                                            leftwing.status == 0 ? "dark:bg-red-500" : "dark:bg-gray-500"
                                                        }`}>
                                            <h1 className="text-4xl align-center">{leftwing.seatNo}</h1>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 ">
                            <h2 className="font-bold text-3xl mb-5">Right Wing</h2>
                            <div className="grid grid-cols-5 shadow-sm sm:rounded">
                                {rightwings.map((rightwing,index) => (
                                    <Link href={route('examroom.seat', { examroom: examRoom.id, seat: rightwing.seatNo })} key={index}>
                                        <div className={`flex items-center justify-center mb-5 ml-5 sm:rounded-lg cursor-pointer h-20 ${
                                                            rightwing.status == 0 ? "dark:bg-red-500" : "dark:bg-gray-500"
                                                        }`}>
                                            <h1 className="text-4xl align-center">{rightwing.seatNo}</h1>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                                
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
