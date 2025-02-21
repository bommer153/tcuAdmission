<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamRoom;
use App\Models\ExamDate;
use App\Models\ExamTime;
use App\Models\applicant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ExamRoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $examRoom = ExamRoom::query();
        $examRooms = $examRoom->get(); 
        $examTime = ExamTime::where('status','1')->first();
        $examDate = ExamDate::where('status','1')->first();
       
        $examRoomArray = array();
        $applicantCount = 0;
            foreach ($examRooms as $examRoom){
                $applicant = applicant::where([
                    'exam_room_no' => $examRoom->room_no,
                    'exam_time' => $examTime->exam_time,
                    'exam_date' => $examDate->exam_date,
                ])->count();

               
                array_push($examRoomArray,['id'=>$examRoom->id,'room_no' => $examRoom->room_no, 'applicantCount' => $applicant]);
            }

            //dd($examRoomArray);
        return inertia('examroom/index',[
            'examTime' => $examTime,
            'examDate' => $examDate,
            'examRooms' => $examRoomArray,         
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ExamRoom $examroom)
    {
        $examTime = ExamTime::where('status','1')->first();
        $examDate = ExamDate::where('status','1')->first();

        $leftwing = array();
        $rightwing = array();

        for($i = 1; $i<=20; $i++){
            $seatNo = "L".$i;
            array_push($leftwing,["seatNo" => $seatNo, "status" =>"0"]);
            $checkSched = applicant::where([
                'exam_date' => $examDate->exam_date,
                'exam_time' => $examTime->exam_time,
                'exam_room_no' => $examroom->room_no,
                'exam_seat_no' => $seatNo,
            ])->first();

            if($checkSched){
                $leftwing[$i-1]['status'] = '1';
            }
        }

        for($i = 1; $i<=15; $i++){
            $seatNo = "R".$i;
            array_push($rightwing,["seatNo" => $seatNo, "status" =>"0"]);  
            
            $checkSched = applicant::where([
                'exam_date' => $examDate->exam_date,
                'exam_time' => $examTime->exam_time,
                'exam_room_no' => $examroom->room_no,
                'exam_seat_no' => $seatNo,
            ])->first();

            if($checkSched){
                $rightwing[$i-1]['status'] = '1';
            }
        }

        //dd($leftwing);
        return inertia('examroom/show',[
            'examTime' => $examTime,
            'examDate' => $examDate,
            'examRoom' => $examroom, 
            'leftwings' => $leftwing,
            'rightwings' => $rightwing,
            'success' => session('success'),           
         ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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

    public function seat(ExamRoom $examroom, $seat)
    {
        $examTime = ExamTime::where('status','1')->first();
        $examDate = ExamDate::where('status','1')->first();

        $checkSched = applicant::with('validatedBy')->where([
            'exam_date' => $examDate->exam_date,
            'exam_time' => $examTime->exam_time,
            'exam_room_no' => $examroom->room_no,
            'exam_seat_no' => $seat,
        ])->first();

        //dd($checkSched);
        return inertia('examroom/seat',[
            'examTimes' => $examTime,
            'examDates' => $examDate,
            'examRooms' => $examroom, 
            'seat' => $seat,            
            'applicant' => $checkSched,
            'success' => session('success'),           
         ]);
    }

    public function search(Request $request)
    {

        $applicant = applicant::query();
        $query = $request->input('query', '');

        if (!$query) {
            return response()->json([]); // Return empty array if no query
        }

        
        $applicants = $applicant->with('validatedBy')->whereRaw("CONCAT(first_name, ' ', middle_name, ' ', last_name) LIKE ?", ["%{$query}%"])->get();
         
        
        return response()->json($applicants);

    }

    public function assign(Request $request,$examRoom,$seat,$applicant){
        
        $request->validate([
            'image_upload' => 'required',
        ],[
            'image_upload.required' => 'Image Capture is required',
        ]);

       
        $checkIfExist = applicant::where([
            'exam_date' => $request->examDate,
            'exam_time' => $request->examTime,
            'exam_room_no' => $request->examRoomNo,
            'exam_seat_no' => $seat,
        ])->first();

        

        if($checkIfExist){
            return redirect()->route('examroom.seat',['examroom'=>$examRoom,'seat'=>$seat])->with('success', 'Seat Already Taken'); 
        }else{
            $base64Image  = $request->image_upload;
            $extension = explode('/', mime_content_type($base64Image))[1];
            $fileName = uniqid() . '.' . $extension;
            $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));   
            
            $update = applicant::findOrFail($applicant)
            ->update([
                'exam_date' => $request->examDate,
                'exam_time' => $request->examTime,
                'exam_room_no' => $request->examRoomNo,
                'exam_seat_no' => $seat,
                'image_captured' => $fileName,
                'printed_by' => auth::id(),
                'finish_date' => now(),
            ]);
    
            $path = Storage::disk('snap')->put($fileName, $imageData);    
            return redirect()->route('examroom.seat',['examroom'=>$examRoom,'seat'=>$seat])->with('success', 'Room Assigned Updated'); 
        }
       

       
    }
}
