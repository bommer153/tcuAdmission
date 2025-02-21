import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';

export default function Settings({ auth, errors, examDates, examTimes, examRooms ,success }) {

    //GET Data
    const { data: examDateData, setData: setExamDateData, post: addDate, errors: examDateError } = useForm({
        examDate: "",
    });

    const { data: examTimeData, setData: setExamTimeData, post: addTime, errors: examTimeError } = useForm({
        examStartTime: "",
        examEndTime: "",
    });

    const { data: roomNoData, setData: setRoomNoData, post:addRoom, errors: roomNoError } = useForm({
        roomNo: "",
    });

    //PUT Data
    const { put: assignDate } = useForm({
        _method: "PUT",
    });

    const { put: assignTime } = useForm({
        _method: "PUT",
    });

    const { put: assignRoom } = useForm({
        _method: "PUT",
    });

    //Submit Post

    const addExamDate = (e) => {
        e.preventDefault();

        addDate(route('date.add'), {
            onFinish: () => {
                toast.success(success || 'Date Added');
            },
        })
    };

    const addExamTime = (e) => {
        e.preventDefault();

        addTime(route('shift.add'), {
            onFinish: () => {
                toast.success(success || 'Date Added');
            },
        })
    };

    const addRoomNo = (e) => {
        e.preventDefault();

        addTime(route('shift.add'), {
            onFinish: () => {
                toast.success(success || 'Date Added');
            },
        })
    };

    //Submit Put
    const assignExamDate = (id, e) => {
        e.preventDefault();

        assignDate(route('date.assign', id), {
            onFinish: () => {
                toast.success(success || 'Date Added');
            },
        })
    };

    const assignExamTime = (id, e) => {
        e.preventDefault();

        assignTime(route('shift.assign', id), {
            onFinish: () => {
                toast.success(success || 'Date Added');
            },
        })
    };

    const assignRoomNo = (id, e) => {
        e.preventDefault();

        assignTime(route('shift.assign', id), {
            onFinish: () => {
                toast.success(success || 'Date Added');
            },
        })
    };
    

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Settings</h2>}
        >
            <Head title="Settings" />

            <div className="py-12 px-12">

                {success && (
                    <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-2 px-10">
                    <div className="px-5">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">

                                <form onSubmit={addExamDate} className="grid grid-cols-3">
                                    <div className="col-span-2">
                                        <InputLabel htmlFor="date" value="Exam Date" />
                                        <TextInput
                                            id="date"
                                            type="date"
                                            name="examDate"
                                            value={examDateData.examDate}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setExamDateData("examDate", e.target.value)}
                                        >
                                        </TextInput>
                                        <InputError message={examDateError.examDate} className="mt-2" />
                                    </div>
                                    <div className="ml-2 mt-2">
                                        <InputLabel htmlFor="addDate" value="." />
                                        <Button> + </Button>
                                    </div>
                                </form>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded">
                                    <div className="p-2 text-gray-900 dark:text-gray-100">
                                        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-auto ">
                                            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500'>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {examDates.map((examDate) =>
                                                    <tr key={examDate.id}>
                                                        <td>{examDate.exam_date}</td>
                                                        <td>{examDate.status}</td>
                                                        <td><Button onClick={(e) => assignExamDate(examDate.id, e)} className="text-xs">♦</Button></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-5">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <form onSubmit={addExamTime} className="grid grid-cols-3">
                                    <div className="col-span-1">
                                        <InputLabel htmlFor="startTime" value="Start Time" />
                                        <TextInput
                                            id="time"
                                            type="time"
                                            name="examStartTime"
                                            value={examTimeData.examStartTime}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setExamTimeData("examStartTime", e.target.value)}
                                        >
                                        </TextInput>
                                        <InputError message={examTimeError.examStartTime} className="mt-2" />
                                    </div>

                                    <div className="col-span-1">
                                        <InputLabel htmlFor="endTime" value="End Time" />
                                        <TextInput
                                            id="endTime"
                                            type="time"
                                            name="examEndTime"
                                            value={examTimeData.examEndTime}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setExamTimeData("examEndTime", e.target.value)}
                                        >
                                        </TextInput>
                                        <InputError message={examTimeError.examEndTime} className="mt-2" />
                                    </div>
                                    <div className="ml-2 mt-2">
                                        <InputLabel htmlFor="addDate" value="." />
                                        <Button> + </Button>
                                    </div>
                                </form>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded">
                                    <div className="p-2 text-gray-900 dark:text-gray-100">
                                        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-auto ">
                                            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500'>
                                                <tr>
                                                    <th>Shift</th>
                                                    <th>Status</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {examTimes.map((examTime) =>
                                                    <tr key={examTime.id}>
                                                        <td>{examTime.exam_time}</td>
                                                        <td>{examTime.status}</td>
                                                        <td><Button onClick={(e) => assignExamTime(examTime.id, e)} className="text-xs">♦</Button></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 ">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <form onSubmit={assignRoomNo} className="grid grid-cols-3">
                                    <div className="col-span-1">
                                        <InputLabel htmlFor="roomNo" value="Room Number" />
                                        <TextInput
                                            id="roomNo"
                                            type="number"
                                            name="roomNo"
                                            value={roomNoData.roomNo}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setRoomNoData("roomNo", e.target.value)}
                                        >
                                        </TextInput>
                                        <InputError message={roomNoError.roomNo} className="mt-2" />
                                    </div>

                                   
                                    <div className="ml-2 mt-2">
                                        <InputLabel htmlFor="addDate" value="." />
                                        <Button> + </Button>
                                    </div>
                                </form>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded">
                                    <div className="p-2 text-gray-900 dark:text-gray-100">
                                        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-auto ">
                                            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500'>
                                                <tr>
                                                    <th>Room No</th>
                                                    <th>Status</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {examRooms.map((examRoom) =>
                                                    <tr key={examRoom.id}>
                                                        <td>{examRoom.room_no}</td>
                                                        <td>{examRoom.status}</td>
                                                        <td><Button onClick={(e) => assignRoomNo(examRoom.id, e)} className="text-xs">♦</Button></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
