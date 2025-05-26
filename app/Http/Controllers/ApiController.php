<?php

namespace App\Http\Controllers;

use App\Models\applicant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $query = applicant::select(
           'first_name', 'middle_name', 'last_name', 'sex', 'age', 'dob', 'address', 'barangay',
                    'zip_code', 'contact_no', 'nationality', 'junior_high_school', 'senior_high_school', 'senior_high_school_year_graduated', 
                    'lrn', 'strand', 'g11_gwa1', 'g11_gwa2', 'g12_gwa1', 'g12_gwa2',
                    'first_course', 'second_course', 'third_course',
                    'name_of_parent', 'parent_comelec_no', 'student_comelec_no',
                    'exam_date', 'exam_time', 'exam_room_no', 'exam_seat_no',
                    DB::raw("
                        CAST(
                            (
                                (
                                    ((g11_gwa1 + g11_gwa2) / 2 * 0.8) 
                                    + (g12_gwa1 * 0.2)
                                ) * 0.4
                            ) 
                            + 
                            (
                                (((exam_score / 150) * 100 * 0.5) + 50) * 0.6
                            )
                        AS DECIMAL(10,2)
                        ) AS admission_grade
                    ")
                )
                ->whereNotNull('exam_score')
                ->whereRaw("
                            CAST(
                                (
                                    (
                                        ((g11_gwa1 + g11_gwa2) / 2 * 0.8) 
                                        + (g12_gwa1 * 0.2)
                                    ) * 0.4
                                ) 
                                + 
                                (
                                    (((exam_score / 150) * 100 * 0.5) + 50) * 0.6
                                )
                            AS DECIMAL(10,2)
                            ) >= 89.76 
                            AND
                            CAST(
                                (
                                    (
                                        ((g11_gwa1 + g11_gwa2) / 2 * 0.8) 
                                        + (g12_gwa1 * 0.2)
                                    ) * 0.4
                                ) 
                                + 
                                (
                                    (((exam_score / 150) * 100 * 0.5) + 50) * 0.6
                                )
                            AS DECIMAL(10,2)
                            ) <= 100
                        ")
                ->orderBy('admission_grade', 'desc')
                ->get();


        // return response()->json(['message' => 'API index route working!']);
        return response()->json([
            'count' => $query->count(),
            'data' => $query
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return response()->json(['message' => 'Data received', 'data' => $request->all()]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
