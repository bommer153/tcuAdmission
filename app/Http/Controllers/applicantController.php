<?php

namespace App\Http\Controllers;

use App\Models\ActionLogs;
use App\Models\applicant;
use App\Models\courses;
use App\Models\barangay;
use App\Models\ExamDate;
use App\Models\ExamRoom;
use App\Models\ExamTime;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Imports\ApplicantImport;
use App\Imports\ApplicantAls;
use App\Exports\applicantFormat;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class applicantController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function dashboard(Request $request)
    {

        $barangays = barangay::with('myApplicants', 'myApplicantsWithPermit')->get();
        $todaysFinish = applicant::whereDate('finish_date', now())->count();
        $totalFinish = applicant::join('barangays', 'barangays.barangay', '=', 'applicants.barangay')->whereNotNull('applicants.printed_by')->count();
        //$totalFinish = applicant::whereNotNull('printed_by')->count(); 
        //applicant::whereNotNull('finish_date')->count()

        // SELECT * FROM `applicants` WHERE `senior_high_school` LIKE '%olivarez%';

        // $olivarez = Applicant::whereRaw('LOWER(senior_high_school) LIKE ?', ['%olivarez%'])->orderBy('exam_time', 'desc')
        //     ->get(['first_name', 'middle_name', 'last_name', 'exam_date', 'exam_time', 'exam_room_no', 'exam_seat_no', 'senior_high_school', 'contact_no'])
        //     ->map(function ($item, $key) {
        //         return [
        //             'number' => $key + 1,
        //             'name' => "{$item->first_name} {$item->middle_name} {$item->last_name}",
        //             'schedule' => "{$item->exam_date} {$item->exam_time} Room {$item->exam_room_no} Seat {$item->exam_seat_no}",
        //             'senior_high_school' => $item->senior_high_school,
        //             'contact_no' => $item->contact_no,
        //         ];
        //     });

        $athleteApplicant = DB::table('applicants')
                            ->where('athlete', 'Yes')
                            ->select(
                        'id',
                                'exam_score',
                                'first_course as firstChoice',
                                'second_course as secondChoice',
                                'third_course as thirdChoice',
                                'g11_gwa1 as g11gwa1',
                                'g11_gwa2 as g11gwa2',
                                'g12_gwa1 as g12gwa1',
                                'g12_gwa2 as g12gwa2',
                                DB::raw("
                                    CONCAT(
                                        UPPER(TRIM(last_name)), ', ',
                                        CONCAT(
                                            UPPER(LEFT(TRIM(first_name), 1)),
                                            LOWER(SUBSTRING(TRIM(first_name), 2)),
                                            ' ',
                                            UPPER(LEFT(TRIM(middle_name), 1)),
                                            LOWER(SUBSTRING(TRIM(middle_name), 2))
                                        )
                                    ) as name
                                "),
                                DB::raw("ROUND(((((g11_gwa1 + g11_gwa2) / 2) * 0.8) + (g12_gwa1 * 0.2)) * 0.4, 2) as gwascore"),
                                DB::raw("ROUND((((exam_score / 150) * 100 * 0.5) + 50) * 0.6, 2) as final_exam_score"),
                                DB::raw("ROUND(
                                    (
                                        (((g11_gwa1 + g11_gwa2) / 2 * 0.8 + g12_gwa1 * 0.2) * 0.4)
                                        + 
                                        (((exam_score / 150) * 100 * 0.5 + 50) * 0.6)
                                    ),
                                2) as overall"),
                            )
                            ->orderByDesc('overall')
                            ->get();

        // dd($athleteApplicant);

        if (request("date")) {
            $searchTerm = $request->query("date");
            $results = applicant::whereDate('finish_date', $searchTerm)->count();
        } else {
            $results = null;
        }

        $applicantTotal = applicant::count();
        return inertia('Dashboard', [
            'queryParams' => request()->query() ?: null,
            'results' => $results,
            'barangays' => $barangays,
            'todaysFinish' => $todaysFinish,
            'totalFinish' => $totalFinish,
            'applicantTotal' => $applicantTotal,
            'athleteApplicant' => $athleteApplicant,
            // 'olivarez' => $olivarez,
        ]);
    }
    public function index()
    {
        //phpinfo();



        $applicant = applicant::query();

        if (request("name")) {
            $searchTerm = request("name");
            $results = $applicant->whereRaw("CONCAT(first_name, ' ', middle_name, ' ', last_name) LIKE ?", ["%{$searchTerm}%"]);

        }




        $applicants = $applicant->with('validatedBy', 'printedBy', 'scoredBy')->paginate(20);

        $totalApplicant = applicant::count();

        return inertia('applicant/index', [
            'applicants' => $applicants,
            'totalApplicant' => $totalApplicant,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource min storage.
     *
     * @param  \App\Http\Requests\StoreapplicantRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        //dd($request->files);



        $request->validate([
            'excelFile' => '',
            'applicantType' => 'required',
        ]);

        //dd($request->all());
        try {
            if ($request->applicantType == 'Freshmen') {
                Excel::import(new ApplicantImport, $request->file('excelFile'));
            } else {
                Excel::import(new ApplicantAls, $request->file('excelFile'));
            }

            return redirect()->route('applicant.index')->with('success', 'Excel ' . $request->applicantType . 'was Imported');
        } catch (\Exception $e) {
            dd($e->getMessage());
        }


    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\applicant  $applicant
     * @return \Illuminate\Http\Response
     */
    public function show(applicant $applicant)
    {
        $courses = courses::get();

        return inertia('applicant/show', [
            'applicant' => $applicant,
            'courses' => $courses,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\applicant  $applicant
     * @return \Illuminate\Http\Response
     */
    public function edit(applicant $applicant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateapplicantRequest  $request
     * @param  \App\Models\applicant  $applicant
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, applicant $applicant)
    {
        $request->validate([
            'firstName' => 'required',
            'middleName' => 'required',
            'lastName' => 'required',
            'sex' => 'required',
            'age' => 'required',
            'birthDate' => 'required',
            'religion' => 'required',
            'address' => 'required',
            'barangay' => 'required',
            'zipCode' => 'required',
            'contactNo' => 'required',
            'civilStatus' => 'required',

            'firstCourse' => 'required',
            'secondCourse' => 'required',
            'thirdCourse' => 'required',
            'parentName' => 'required',
            'parentContactNo' => 'required',
            'parentComelecNo' => 'required',
        ]);

        $data = [
            'first_name' => $request->firstName,
            'middle_name' => $request->middleName,
            'last_name' => $request->lastName,
            'sex' => $request->sex,
            'age' => $request->age,
            'dob' => $request->birthDate,
            'birth_place' => $request->birthPlace,
            'religion' => $request->religion,
            'address' => $request->address,
            'barangay' => $request->barangay,
            'zip_code' => $request->zipCode,
            'contact_no' => $request->contactNo,
            'nationality' => $request->nationality,
            'civil_status' => $request->civilStatus,
            'ethnic_background' => $request->ethnicBackground,

            'junior_high_school' => $request->juniorHighschool,
            'junior_high_school_year_graduated' => $request->juniorHighschoolYear,
            'senior_high_school' => $request->seniorHighschool,
            'senior_high_school_year_graduated' => $request->seniorHighschoolYear,
            'lrn' => $request->lrn,
            'strand' => $request->strand,
            'g11_gwa1' => $request->g11gwa1,
            'g11_gwa2' => $request->g11gwa2,
            'g12_gwa1' => $request->g12gwa1,
            'g12_gwa2' => $request->g12gwa2,

            'first_course' => $request->firstCourse,
            'second_course' => $request->secondCourse,
            'third_course' => $request->thirdCourse,
            'name_of_parent' => $request->parentName,
            'parent_contact_no' => $request->parentContactNo,
            'parent_comelec_no' => $request->parentComelecNo,
            'student_comelec_no' => $request->studentComelecNo,

            'als_learning_center' => $request->alsLearningCenter,
            'als_learning_center_year_graduated' => $request->alsLearningYear,
            'als_accreditation_equivalent_testing_date' => $request->alsTestingDate,
            'als_accreditation_equivalent_rating' => $request->alsRating,
            'als_accreditation_equivalent_remarks' => $request->alsRemarks,
        ];

        // TRACK CHANGES
        $original = $applicant->only(array_keys($data));
        $changedFields = [];
        $previousValues = [];

        foreach ($data as $key => $value) {
            if (isset($original[$key]) && $original[$key] != $value) {
                $changedFields[] = $key;
                $previousValues[$key] = $original[$key];
            }
        }

        // UPDATE DATE OF APPLICANT
        $applicant->update($data);

        // TRIGGER LOGS IF THERE IS A CHANGE OF DATA
        if (!empty($changedFields)) {
            $applicantName = ucwords(strtolower("{$original['first_name']} {$original['middle_name']} {$original['last_name']}"));

            ActionLogs::create([
                'action' => 'update',
                'user_id' => Auth::id(),
                'target_id' => $applicant->id,
                'metadata' => json_encode([
                    'changed_fields' => $changedFields,
                    'previous_values' => $previousValues,
                    'new_values' => $applicant->only($changedFields),
                    'description' => "Updated applicant: \"$applicantName\""
                ]),
            ]);
        }

        return redirect()->route('applicant.show', $applicant->id)->with('success', 'Applicant Updated');
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\applicant  $applicant
     * @return \Illuminate\Http\Response
     */
    public function destroy(applicant $applicant)
    {
        //
    }

    public function updateRemarks(applicant $applicant, Request $request)
    {



        $request->validate([
            'status' => 'required'
        ]);


        $applicant->update([
            'remarks' => $request->remarks,
            'status' => $request->status,
            'validated_by' => auth::id(),
        ]);



        if ($request->fromHome) {
            return redirect()->back()->with('success', 'Remarks Updated');
        }
        return redirect()->route('applicant.show', $applicant->id)->with('success', 'Remarks Updated');
    }

    public function updateAthlete(applicant $applicant, Request $request)
    {

        $request->validate([
            'athlete' => 'required'
        ]);


        $applicant->update([
            'athlete' => $request->athlete,
        ]);



        if ($request->athlete) {
            return redirect()->back()->with('success', 'Athlete Updated');
        }
        return redirect()->route('applicant.show', $applicant->id)->with('success', 'Athlete Updated');
    }

    public function updateScore(applicant $applicant, Request $request)
    {
        // 1. Validate request early
        $request->validate([
            'exam_score' => 'required'
        ]);

        // 2. Format full name
        $applicantName = ucwords(strtolower("{$applicant->first_name} {$applicant->middle_name} {$applicant->last_name}"));

        // 3. Store previous values
        $previousValues = $applicant->only(['exam_score', 'scored_by']);

        // 4. Prepare new values
        $newValues = [
            'exam_score' => $request->exam_score,
            'scored_by' => Auth::id(),
        ];

        // 5. Determine changed fields
        $changedFields = [];
        foreach ($newValues as $key => $value) {
            if ((string) $applicant->$key !== (string) $value) {
                $changedFields[] = $key;
            }
        }

        // 6. Log only if previously scored and values changed
        if (!is_null($applicant->scored_by) && !empty($changedFields)) {
            ActionLogs::create([
                'action' => 'rescore',
                'user_id' => Auth::id(),
                'target_id' => $applicant->id,
                'metadata' => json_encode([
                    'changed_fields' => $changedFields,
                    'previous_values' => array_intersect_key($previousValues, array_flip($changedFields)),
                    'new_values' => array_intersect_key($newValues, array_flip($changedFields)),
                    'description' => "Re-score Applicant: \"{$applicantName}\""
                ]),
            ]);
        }

        // 7. Update applicant
        $applicant->update($newValues);

        // 8. Redirect with success
        return redirect()->back()->with('success', 'Score Updated');
    }


    public function downloadExcel()
    {
        return Excel::download(new applicantFormat, 'freshmen.xlsx', Excel::XLSX);
    }



    public function removeSched(Applicant $applicant)
    {
        $applicantName = ucwords(strtolower("{$applicant->first_name} {$applicant->middle_name} {$applicant->last_name}"));

        $previousValues = $applicant->only([
            'exam_time',
            'exam_date',
            'exam_room_no',
            'exam_seat_no',
            'printed_by',
            'finish_date'
        ]);

        $newValues = [
            'exam_time' => null,
            'exam_date' => null,
            'exam_room_no' => null,
            'exam_seat_no' => null,
            'printed_by' => null,
            'finish_date' => null,
        ];

        $changedFields = [];
        foreach ($newValues as $key => $value) {
            if ($applicant->$key != $value) {
                $changedFields[] = $key;
            }
        }

        DB::transaction(function () use ($applicant, $applicantName, $previousValues, $newValues, $changedFields) {
            if (!empty($changedFields)) {
                ActionLogs::create([
                    'action' => 'rmv-schd',
                    'user_id' => Auth::id(),
                    'target_id' => $applicant->id,
                    'metadata' => json_encode([
                        'changed_fields' => $changedFields,
                        'previous_values' => $previousValues,
                        'new_values' => collect($newValues)->only($changedFields),
                        'description' => "Remove-Schedule of applicant: \"{$applicantName}\""
                    ]),
                ]);
            }

            $applicant->update($newValues);
        });

        return redirect()->back()->with('success', 'Schedule Removed');
    }


    public function filterDate()
    {
        $applicants = applicant::query();
        $totalApplicant = $applicants->count();


        return inertia('dashboard', [
            'applicants' => $applicants,
            'totalApplicant' => $totalApplicant,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function getApplicantApi()
    {
        return response()->json([
            'applicants' => applicant::select('first_name', 'middle_name', 'last_name')->take(10)->get(),
        ]);
    }

    public function examinedResult(Request $request)
    {

        $examDate = ExamDate::get();
        $examTime = ExamTime::get();
        $examRooms = ExamRoom::get();

        $user = Auth::user();
        $curr_user = $user->id;
        $curr_role = $user->role;

        // Base query
        $query = DB::table('applicants')
            ->join('users', 'users.id', '=', 'applicants.scored_by')
            ->select(
                DB::raw("CONCAT(applicants.first_name, ' ', applicants.middle_name, ' ', applicants.last_name) as name"),
                DB::raw("(((((g11_gwa1 + g11_gwa2) / 2) * 0.8) + (g12_gwa1 * 0.2))) * 0.4 as gwascore"),
                DB::raw("(((exam_score / 150) * 100 * 0.5) + 50) * 0.6 as final_exam_score"),
                DB::raw("(((g11_gwa1 + g11_gwa2) / 2 * 0.8 + g12_gwa1 * 0.2) * 0.4) + ((((exam_score / 150) * 100 * 0.5) + 50) * 0.6) as overall"),
                'exam_score',
                'first_course as firstChoice',
                'second_course as secondChoice',
                'third_course as thirdChoice',
                'exam_date',
                'exam_time',
                'exam_room_no',
                'exam_seat_no',
                'contact_no',
                'g11_gwa1',
                'g11_gwa2',
                'g12_gwa1',
                'g12_gwa2',
                'senior_high_school',
                'users.name as scorer_name'
            )
            ->whereNotNull('applicants.scored_by');

        // Apply additional filter if role is 3
        if ($curr_role == 3) {
            $query->where('applicants.scored_by', $curr_user);
        }

        $query->when(request('exam_date'), fn($q) => $q->where('exam_date', request('exam_date')))
            ->when(request('exam_time'), fn($q) => $q->where('exam_time', request('exam_time')))
            ->when(request('exam_room_no'), fn($q) => $q->where('exam_room_no', request('exam_room_no')));


        $applicantResultExam = $query
            ->orderByRaw("LEFT(exam_seat_no, 1) ASC")
            ->orderByRaw("CAST(SUBSTRING(exam_seat_no, 2) AS UNSIGNED) DESC")
            ->get();

        return inertia('examined/show', [
            'queryParams' => request()->query() ?: null,
            'examDates' => $examDate,
            'examTimes' => $examTime,
            'examRooms' => $examRooms,
            'applicantResultExam' => $applicantResultExam,
        ]);
    }

}
