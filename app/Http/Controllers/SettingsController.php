<?php

namespace App\Http\Controllers;
use App\Models\ExamRoom;
use App\Models\ExamDate;
use App\Models\ExamTime;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SettingsController extends Controller
{

    public function index(){

        $examTime = ExamTime::get();
        $examDate = ExamDate::get();  
        $examRooms = ExamRoom::get();     

        return inertia('settings/index',[
               'examTimes' => $examTime,
               'examDates' => $examDate,
               'examRooms' => $examRooms,
               'success' => session('success'),
         ]);
    }

    public function addDate(Request $request){
        $request->validate([
            'examDate' => 'required',
        ]);
        
        $date = Carbon::parse($request->examDate)->format('F j, Y');
     
        ExamDate::create([
            'exam_date' => $date
        ]);

        return redirect()->route('settings.index')->with('success', 'Date Added');
    }

    public function updateDate(ExamDate $examDate){        
        
        ExamDate::query()->update(['status' => 0]);

       $examDate->update([
            'status' => '1',
       ]);

        return redirect()->route('settings.index')->with('success', 'Date Updated');
    }

    public function addShift(Request $request){
        $request->validate([
            'examStartTime' => 'required',
            'examEndTime' => 'required',
        ]);
        
        $startTime = Carbon::createFromFormat('H:i', $request->examStartTime)->format('g:i A');
        $endTime = Carbon::createFromFormat('H:i', $request->examEndTime)->format('g:i A');

        $time = $startTime." - ".$endTime;
        ExamTime::create([
            'exam_time' => $time
        ]);

        return redirect()->route('settings.index')->with('success', 'Shift Added');
    }

    public function updateTime(ExamTime $examTime){        
        
        ExamTime::query()->update(['status' => 0]);

       $examTime->update([
            'status' => '1',
       ]);

        return redirect()->route('settings.index')->with('success', 'Date Updated');
    }
}
