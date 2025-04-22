<?php

namespace App\Http\Controllers;

use App\Models\ActionLogs;
use App\Models\applicant;
use App\Models\courses;
use App\Models\barangay;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Imports\ApplicantImport;
use App\Imports\ApplicantAls;
use App\Exports\applicantFormat;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Auth;

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

        $athleteApplicant = applicant::where('athlete', '=', 'Yes')
                                        ->select('id', 'first_name' , 'middle_name', 'last_name',  
                                                    'first_course', 'second_course', 'third_course','exam_score')
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

        //dd($request->all());

        $applicant->update([
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


        ]);


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

        $app = applicant::findOrFail($applicant->id);
        $applicantName = ucwords(strtolower("$app->first_name $app->middle_name $app->last_name"));

        $previousValues = $applicant->only(['exam_score', 'scored_by']);

        $newValues = [
            'exam_score' => $request->exam_score,
            'scored_by' => Auth::id(),
        ];
        
        $changedFields = [];

        foreach ($newValues as $key => $value) {
            if ($applicant->$key != $value) {
                $changedFields[] = $key;
            }
        }


        $request->validate([
            'exam_score' => 'required'
        ]);

        $applicant->update([
            'exam_score' => $request->exam_score,
            'scored_by' => auth::id(),
        ]);

        // ENCODING LOGS
        if (!empty($changedFields)) {
            ActionLogs::create([
                'action' => 'score',
                'user_id' => Auth::id(),
                'target_id' => $applicant->id,
                'metadata' => json_encode([
                    'changed_fields' => $changedFields,
                    'previous_values' => array_intersect_key($previousValues, array_flip($changedFields)),
                    'new_values' => $applicant->only($changedFields),
                    'description' => "Score Applicant: \"$applicantName\""
                ]),
            ]);
        }
        //dd($request->all());


        return redirect()->back()->with('success', 'Score Updated');

    }

    public function downloadExcel()
    {
        return Excel::download(new applicantFormat, 'freshmen.xlsx', Excel::XLSX);
    }

    public function removeSched($applicant)
    {

        applicant::findOrFail($applicant)->update([
            'exam_time' => null,
            'exam_date' => null,
            'exam_room_no' => null,
            'exam_seat_no' => null,
            'printed_by' => null,
            'finish_date' => null,
        ]);

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
            'applicants' => applicant::get()->take(10),
        ]);
    }
}
