import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Pagination from '@/Components/pagination';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { faDownload, faEye, faFile, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import SelectInput from '@/Components/SelectInput';
import Modal from '@/Components/Modal';


export default function index(props, queryParams = null) {
    console.log(props);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [isScoreOpen, setIsScoreOpen] = useState(false);
    const [selectedScore, setSelectedScore] = useState(null);

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);

        setRemarksData({ ...user, fromHome: true });
        setAthleteData({ ...user });

    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };



    const openScore = (user) => {
        setSelectedScore(user);
        setIsScoreOpen(true);

        setScoreData((prevScoreData) => {
            const g11Score = Number(((parseFloat(user.g11_gwa1) + parseFloat(user.g11_gwa2)) / 2) * 0.8).toFixed(2);
            const g12Score = Number(parseFloat(user.g12_gwa1) * 0.2).toFixed(2);
            const totalGwa = Number(parseFloat(g11Score) + parseFloat(g12Score)).toFixed(2);
            const totalGwa4 = Number(totalGwa * 0.4).toFixed(2);
            const initialScore = Number((parseFloat(user.exam_score) / 150) * 100).toFixed(2);
            const initialScore2 = Number((initialScore * 0.5) + 50).toFixed(2);
            const finalExamScore = Number(initialScore2 * 0.6).toFixed(2);
            const finalScore = Number(parseFloat(totalGwa4) + parseFloat(finalExamScore)).toFixed(2);


            return {
                ...user,
                g11Score,
                g12Score,
                totalGwa,
                totalGwa4,
                initialScore,
                finalExamScore,
                finalScore,
            };
        });

        console.log(scoreData);
    };

    const closeScore = () => {
        setSelectedScore(null);
        setIsScoreOpen(false);
    };



    queryParams = props.queryParams || {};
    const { data, setData, post, errors } = useForm({
        excelFile: '',
        applicantType: '',
    });

    const { data: remarksData, setData: setRemarksData, put: assignRemarks, errors: remarksError } = useForm({
        fromHome: true,
    });

    const { data: scoreData, setData: setScoreData, put: assignScore, errors: scoreError } = useForm({
        g11Score: "",
        g12Score: "",
        totalGwa: "",
        totalGwa4: "",
        finalScore: "",

    });

    const { data: athleteData, setData: setAthleteData, put: assignAthlete, errors: athleteError } = useForm({
        athlete: '',
        fromHome: true,
    });


    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        router.get(route("applicant.index"), queryParams);
    };

    const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;
        searchFieldChanged(name, e.target.value);
    };

    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        setLoading(true);

        post(route('applicant.store'), {
            onFinish: () => {
                setLoading(false); // Reset loading state after the post request finishes
            },
        });
    }

    const onSubmitRemarks = (e) => {
        e.preventDefault();
        assignRemarks(route('applicant.updateRemarks', remarksData.id), {
            onFinish: () => {
                if (remarksError.status.message) {
                    setSelectedUser(null);
                    setIsModalOpen(false);
                } else {

                }
            },
        });
    }

    const onSubmitScore = (e) => {
        e.preventDefault();
        assignScore(route('applicant.updateScore', scoreData.id), {
            onFinish: () => {
                setIsScoreOpen(false);

                if (props.success) {
                    setSelectedUser(null);
                    setIsScoreOpen(false);
                } else {

                }
            },
        });
    }

    const onSubmitAthlete = (e) => {
        e.preventDefault();
        assignAthlete(route('applicant.updateAthlete', athleteData.id), {
            onFinish: () => {
                if (athleteError.athlete.message) {
                    setSelectedUser(null);
                    setIsModalOpen(false);
                } else {

                }
            },
        });
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Applicants</h2>}
        >
            <Head title="Applicants" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {props.success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {props.success}
                        </div>
                    )}

                    {props.auth.user.role === '1' && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-5">
                            <div className="p-6 text-gray-900 dark:text-gray-100 grid grid-cols-2">
                                <div>
                                    <form onSubmit={onSubmit} className='grid grid-cols-1'>
                                        <div>
                                            <div className="flex mb-2">
                                                <div className="flex items-center me-4">
                                                    <input
                                                        id="inline-radio"
                                                        type="radio"
                                                        value="Freshmen"
                                                        name="applicantType"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        onChange={(e) => setData("applicantType", e.target.value)}
                                                    />
                                                    <label htmlFor="inline-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Freshmen</label>
                                                </div>
                                                <div className="flex items-center me-4">
                                                    <input
                                                        id="inline-2-radio"
                                                        type="radio"
                                                        value="ALS"
                                                        name="applicantType"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        onChange={(e) => setData("applicantType", e.target.value)}
                                                    />
                                                    <label htmlFor="inline-2-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">ALS Passer</label>
                                                </div>

                                            </div>
                                            <InputError message={errors.applicantType} className='mt-2' />

                                            <InputLabel
                                                htmlFor="uploadFile" value="Upload Excel File">
                                            </InputLabel>

                                            <TextInput
                                                name="excelFile"
                                                type="file"
                                                className="flex"
                                                onChange={e => setData('excelFile', e.target.files[0])}
                                            ></TextInput>
                                            <InputError message={errors.excelFile} className='mt-2' />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="upload" value="*">
                                            </InputLabel>
                                            <Button id="upload" disabled={loading}>  {loading ? 'Uploading...' : 'Upload File'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>

                                <div>
                                    <h1 className="mb-2">Excel Format </h1>
                                    <a className="mr-10 hover:underline" href="../../storage/source/freshmen.xlsx" download="freshmen.xlsx">
                                        <FontAwesomeIcon icon={faDownload} /><span> Freshmen</span>
                                    </a>
                                    <a className="hover:underline" href="../../storage/source/als.xlsx" download="als.xlsx">
                                        <FontAwesomeIcon icon={faDownload} /><span> ALS</span>
                                    </a>
                                </div>
                                {loading && (
                                    <div className="flex justify-center items-center mt-4">
                                        <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                                        <p className="ml-3 text-gray-700">Uploading...</p>
                                    </div>
                                )}


                            </div>
                        </div>
                    )}


                    <div className='grid grid-cols-3 gap-1'>
                        <div className="bg-white dark:bg-green-800 overflow-hidden shadow-sm sm:rounded-lg mb-5 ">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <h3>Total Applicant : {props.totalApplicant}</h3>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-blue-800 overflow-hidden shadow-sm sm:rounded-lg mb-5 ">
                            <div className="p-6 text-gray-900 dark:text-gray-100">


                            </div>
                        </div>

                        <div className="bg-white dark:bg-red-800 overflow-hidden shadow-sm sm:rounded-lg mb-5 ">
                            <div className="p-6 text-gray-900 dark:text-gray-100">


                            </div>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-auto ">
                                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500'>
                                    <tr>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3">
                                            <TextInput
                                                className="w-full"
                                                defaultValue={queryParams.name}
                                                placeholder="Applicant Name"
                                                onBlur={(e) =>
                                                    searchFieldChanged("name", e.target.value)
                                                }
                                                onKeyPress={(e) => onKeyPress("name", e)}
                                            />
                                        </th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3"></th>

                                    </tr>

                                    <tr>
                                        <th className="px-3 py-3">ID</th>
                                        <th className="px-3 py-3">Name</th>
                                        <th className="px-3 py-3">Exam Date & Time</th>
                                        <th className="px-3 py-3">Room & Seat</th>
                                        <th className="px-3 py-3">Validator</th>
                                        <th className="px-3 py-3">Printed By</th>
                                        <th className="px-3 py-3"></th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {props.applicants.data.map((applicant) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={applicant.id}
                                        >
                                            <td className="px-3 py-2">{applicant.id}</td>

                                            <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                <Link href={route("applicant.show", applicant.id)}>
                                                    {applicant.first_name} {applicant.middle_name} {applicant.last_name}
                                                    {applicant.applicantType === 'ALS' && (
                                                        <span className="bg-green-500 text-black p-1 rounded">{applicant.applicantType}</span>
                                                    )}
                                                </Link>
                                            </th>

                                            <td className="px-3 py-2">{applicant.exam_date} - {applicant.exam_time}</td>
                                            <td className="px-3 py-2 text-nowrap">{applicant.exam_room_no} - {applicant.exam_seat_no}</td>
                                            <td className="px-3 py-2 text-nowrap">{applicant.validated_by?.name}</td>
                                            <td className="px-3 py-2">{applicant.printed_by?.name}</td>
                                            <td className="px-3 py-2 text-nowrap">


                                                <Button className="bg-blue-500"
                                                    onClick={() => openModal(applicant)}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Button>
                                                {(props.auth.user.role === '1' || props.auth.user.role === '4') && (
                                                    <a href={route('pdf.examPermit', applicant.id)} target="_blank" title="RE-PRINT">
                                                        <Button className="bg-green-500">
                                                            <FontAwesomeIcon icon={faFile} />
                                                        </Button>
                                                    </a>
                                                )}
                                                {(props.auth.user.role === '1' || props.auth.user.role === '3') && (
                                                    <Button className="bg-blue-900"
                                                        onClick={() => openScore(applicant)}>

                                                        <FontAwesomeIcon icon={faStar} />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={props.applicants.links} />
                        </div>

                    </div>
                </div>

                {/* Modal */}
                <Modal
                    show={isModalOpen}
                    maxWidth="3xl"
                    closeable={true}
                    onClose={closeModal}
                    width="sm:max-w-5xl"
                    height="h-auto" // Custom height
                >
                    <div className="max-w-7xl mx-auto lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="text-gray-900 dark:text-gray-100 ">
                                {props.auth.user.role === '3' ?
                                    <div className="bg-white dark:bg-gray-800 mt-10 shadow sm:rounded-lg grid grid-cols-3 gap-2 mb-3"></div>
                                    :
                                    <>
                                        <form
                                            onSubmit={onSubmitRemarks}
                                            className="bg-white dark:bg-gray-800 mt-5 shadow sm:rounded-lg grid grid-cols-3 gap-2 mb-3"
                                        >
                                            <div className="mt-4 col-span-2">
                                                <InputLabel htmlFor="remarks" value="Remarks" />
                                                <TextInput
                                                    id="remarks"
                                                    type="text"
                                                    name="remarks"
                                                    value={remarksData.remarks || ""}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setRemarksData("remarks", e.target.value)}
                                                />
                                                <InputError message={remarksError.remarks} className="mt-2" />
                                            </div>

                                            <div className="mt-4 ">
                                                <InputLabel htmlFor="status" value="Status" />
                                                <SelectInput
                                                    id="status"
                                                    name="status"
                                                    value={remarksData.status || ""}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setRemarksData("status", e.target.value)}
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="Complete">Complete</option>
                                                    <option value="Incomplete">Incomplete</option>
                                                </SelectInput>
                                                <InputError message={remarksError.status} className="mt-2" />
                                            </div>
                                            <div className="mt-4 bm-3">
                                                <Button id="button">Validate</Button>
                                            </div>

                                        </form>

                                        <form onSubmit={onSubmitAthlete} >
                                            <div className="mt-4 ">
                                                <InputLabel htmlFor="athlete" value="Athlete" />
                                                <SelectInput
                                                    id="athlete"
                                                    name="athlete"
                                                    value={athleteData.athlete || ""}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setAthleteData("athlete", e.target.value)}
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </SelectInput>
                                                <InputError message={athleteError.athlete} className="mt-2" />
                                            </div>
                                            <button className='my-4 bg-blue-600 text-white rounded p-2 hover:bg-green-600'>submit</button>
                                        </form>

                                    </>


                                }
                                {athleteData.athlete == 'Yes' &&
                                    <div className='flex justify-end'>
                                        <div className='bg-green-700 text-white inline-block p-2 '>ATHLETE</div>
                                    </div>
                                }

                                <div className="grid grid-cols-2">
                                    <div>
                                        <a href={route('applicant.show', 1)} target="_blank" className="bg-blue-600 text-white rounded p-2 hover:bg-green-600 mb-8">
                                            Edit Applicant
                                        </a>
                                        {remarksData.image_captured && <img src={"storage/snap/"+remarksData.image_captured} alt="applicant image" />}
                                        
                                        <h1 className='mt-10'><span className="font-bold">First Name :</span> {remarksData.first_name}</h1>
                                        <h1><span className="font-bold">Middle Name :</span> {remarksData.middle_name}</h1>
                                        <h1><span className="font-bold">Last Name :</span> {remarksData.last_name} </h1>
                                        <hr className="mb-2 mt-2 w-4/5"></hr>
                                        <h1><span className="font-bold">Sex :</span> {remarksData.sex} </h1>
                                        <h1><span className="font-bold">Age :</span> {remarksData.age} </h1>
                                        <h1><span className="font-bold">Birth Date :</span> {remarksData.dob} </h1>
                                        <h1><span className="font-bold">Birth Place :</span> {remarksData.birth_place} </h1>
                                        <h1><span className="font-bold">Religion :</span> {remarksData.religion} </h1>
                                        <h1><span className="font-bold">Address :</span> {remarksData.address} </h1>
                                        <h1><span className="font-bold">Barangay :</span> {remarksData.barangay} </h1>
                                        <h1><span className="font-bold">Zip Code :</span> {remarksData.zip_code} </h1>
                                        <h1><span className="font-bold">Contact No :</span> {remarksData.contact_no} </h1>
                                        <h1><span className="font-bold">Nationality :</span> {remarksData.nationality} </h1>
                                        <h1><span className="font-bold">Civil Status :</span> {remarksData.civil_status} </h1>
                                        <h1><span className="font-bold">Ethnic Background :</span> {remarksData.ethnic_background} </h1>
                                        <hr className="mb-2 mt-2 w-4/5"></hr>
                                        <h1><span className="font-bold">Parent's Name :</span> {remarksData.name_of_parent} </h1>
                                        <h1><span className="font-bold">Parent's Contact No. :</span> {remarksData.parent_contact_no} </h1>
                                        <h1><span className="font-bold">Parent's Comelec No. :</span> {remarksData.parent_comelec_no} </h1>
                                        <h1><span className="font-bold">Student Comelec No. :</span> {remarksData.student_comelec_no} </h1>
                                    </div>
                                    <div>
                                        {remarksData.applicantType == 'Freshmen' && (
                                            <div>
                                                <h1><span className="font-bold">LRN :</span> {remarksData.lrn}</h1>
                                                <h1><span className="font-bold">Strand :</span> {remarksData.strand}</h1>
                                                <br></br>
                                                <h1><span className="font-bold">Junior High School :</span> {remarksData.junior_high_school} </h1>
                                                <h1><span className="font-bold">Junior High School Year Graduated:</span> {remarksData.junior_high_school_year_graduated} </h1>
                                                <br></br>
                                                <h1><span className="font-bold">Senior High School :</span> {remarksData.senior_high_school} </h1>
                                                <h1><span className="font-bold">Senior High School Year Graduated:</span> {remarksData.senior_high_school_year_graduated} </h1>
                                                <h1><span className="font-bold">• Grade 11 - 1st Sem GWA :</span> {remarksData.g11_gwa1} </h1>
                                                <h1><span className="font-bold">• Grade 11 - 2st Sem GWA :</span> {remarksData.g11_gwa2} </h1>
                                                <h1><span className="font-bold">• Grade 12 - 1st Sem GWA :</span> {remarksData.g12_gwa1} </h1>
                                                <h1><span className="font-bold">• Grade 12 - 2st Sem GWA :</span> {remarksData.g12_gwa2} </h1>
                                            </div>
                                        )}

                                        {remarksData.applicantType == 'ALS' && (
                                            <div>
                                                <h1><span className="font-bold">AlS Learning Center:</span> {remarksData.als_learning_center} </h1>
                                                <h1><span className="font-bold">ALS Year Graduated:</span> {remarksData.als_learning_center_year_graduated} </h1>
                                                <h1><span className="font-bold">A&E Testing Date </span> {remarksData.als_accreditation_equivalent_testing_date} </h1>
                                                <h1><span className="font-bold">A&E Rating </span> {remarksData.als_accreditation_equivalent_rating} </h1>
                                                <h1><span className="font-bold">A&E Remarks :</span> {remarksData.als_accreditation_equivalent_remarks} </h1>
                                            </div>
                                        )}
                                        <hr className="mb-2 mt-2 w-4/5"></hr>
                                        <h1><span className="font-bold">First Choice :</span> {remarksData.first_course} </h1>
                                        <h1><span className="font-bold">Second Choice :</span> {remarksData.second_course} </h1>
                                        <h1><span className="font-bold">Third Choice : </span> {remarksData.third_course} </h1>
                                        <hr className="mb-2 mt-2 w-4/5"></hr>
                                        <div className={`${selectedUser?.status == 'Incomplete' ? 'bg-red-500' : 'bg-green-900'} p-3 rounded `}>
                                            <h1><span className="font-bold">Validador :</span> {remarksData.validated_by?.name || "N/A"} </h1>
                                            <h1><span className="font-bold">Remarks :</span> {selectedUser?.remarks || "N/A"} </h1>
                                            <h1><span className="font-bold">Status :</span> {selectedUser?.status || "N/A"} </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </Modal>

                <Modal
                    show={isScoreOpen}
                    maxWidth="3xl"
                    closeable={true}
                    onClose={closeScore}
                    width="sm:max-w-3xl"
                    height="h-[750px]" // Custom height
                >
                    <div className="max-w-7xl mx-auto lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="text-gray-900 dark:text-gray-100 ">
                                <form
                                    onSubmit={onSubmitScore}
                                    className="bg-white dark:bg-gray-800 mt-5 shadow sm:rounded-lg grid grid-cols-3 gap-2 mb-3"
                                >
                                    <div className="mt-4 col-span-2">
                                        <InputLabel htmlFor="score" value="Score" />
                                        <TextInput
                                            id="score"
                                            type="number"
                                            name="exam_score"
                                            value={scoreData.exam_score}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setScoreData("exam_score", e.target.value)}
                                        />
                                        <InputError className="mt-2" />
                                    </div>

                                    <div className="mt-4 bm-3">
                                        <InputLabel value="*" />
                                        <Button id="button">Update Score</Button>
                                    </div>
                                </form>
                                <hr className="mb-5"></hr>
                                <div className="grid grid-cols-3">
                                    <div className="col-span-2">
                                        <h1><span className="font-bold">Name :</span> {scoreData.first_name} {scoreData.last_name}</h1>
                                        <h1><span className="font-bold">Exam Score :</span> {scoreData.exam_score}</h1>
                                    </div>
                                    <div></div>

                                    <div className="col-span-2">
                                        <table className="w-full text-sm text-left rtl:text-right text-white-500 dark:text-white-400 overflow-auto p-5">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                                <tr>
                                                    <th colSpan="2">General Weighted Average</th>
                                                </tr>
                                            </thead>
                                            <tbody >
                                                <tr className="bg-white border dark:bg-gray-800 dark:border-gray-700 p-5">
                                                    <td className="p-3 text-gray-400">Grade Eleven (G11) 1st Semester	</td>
                                                    <td className="p-3 text-gray-400">{scoreData.g11_gwa1}</td>
                                                </tr>
                                                <tr className="bg-white border dark:bg-gray-800 dark:border-gray-700 p-5">
                                                    <td className="p-3 text-gray-400">Grade Eleven (G11) 2nd Semester	</td>
                                                    <td className="p-3 text-gray-400">{scoreData.g11_gwa2}</td>
                                                </tr>

                                                <tr className="bg-white uppercase border dark:bg-gray-800 text-white dark:border-gray-700 p-5">
                                                    <td className="text-right p-3">G11 (1st Sem + 2nd Sem / 2) * 80%</td>
                                                    <td className="p-3 text-white">{scoreData.g11Score}</td>
                                                </tr>

                                                <tr className="bg-white border dark:bg-gray-800 dark:border-gray-700 p-5">
                                                    <td className="p-3 text-gray-400">Grade Twelve (G12) 1st Semester</td>
                                                    <td className="p-3 text-gray-400">{scoreData.g12_gwa1}</td>
                                                </tr>

                                                <tr className="bg-white uppercase border dark:bg-gray-800  dark:border-gray-700 p-5">
                                                    <td className="text-right p-3">G12 1st Sem * 20%</td>
                                                    <td className="p-3  text-white">{scoreData.g12Score}</td>
                                                </tr>

                                                <tr className="bg-white uppercase border dark:bg-gray-800 dark:border-gray-700 p-5">
                                                    <td className="text-right p-3 font-bold">TOTAL</td>
                                                    <td className="p-3  text-white">{scoreData.totalGwa}</td>
                                                </tr>

                                                <tr className="bg-white uppercase border dark:bg-gray-800 dark:border-gray-700 p-5">
                                                    <td className="text-right p-3 font-bold">TOTAL GWA * 40%</td>
                                                    <td className="p-3  text-white">{Number(scoreData.totalGwa4).toFixed(2)}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                    <div></div>

                                    <div className="col-span-3 mt-5 ">
                                        <table className="w-full text-left rtl:text-right text-white-500 dark:text-white-400 overflow-auto p-5">
                                            <thead className="text-l text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white border-b-2 border-white">
                                                <tr>
                                                    <th className="p-5">Exam Score : {scoreData.exam_score}</th>
                                                    <th></th>
                                                </tr>
                                                <tr>
                                                    <th className="p-5">Final Score : {Number(scoreData.finalScore).toFixed(2)}</th>
                                                    <th></th>
                                                </tr>
                                                <tr>
                                                    <th className="p-5">Scored By : {scoreData.scored_by?.name}</th>
                                                    <th></th>
                                                </tr>
                                            </thead>

                                        </table>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>


                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
