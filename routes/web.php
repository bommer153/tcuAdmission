<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\applicantController;
use App\Http\Controllers\ExamRoomController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ActionLogsController;

use App\Http\Controllers\PdfController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/api/getApplicant', [ApplicantController::class, 'getApplicantApi'])->name('api.getApplicantApi');

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', [ApplicantController::class, 'dashboard'])->name('dashboard');    
    Route::get('/api/filterDate', [ApplicantController::class, 'filterDate'])->name('api.filterDate');
    
    //Logs
    Route::get('/action-logs', [ActionLogsController::class,'index'])->name('actionLogs.index');
    
    

    Route::resource('applicant', applicantController::class);
    Route::put('applicant/updateRemarks/{applicant}', [applicantController::class,'updateRemarks'])->name('applicant.updateRemarks');
    Route::put('applicant/updateAthlete/{applicant}', [applicantController::class,'updateAthlete'])->name('applicant.updateAthlete');
    Route::put('applicant/score/{applicant}', [applicantController::class,'updateScore'])->name('applicant.updateScore');
    Route::put('applicant/removesched/{applicant}', [applicantController::class,'removeSched'])->name('applicant.removeSched');

    // Examined
    Route::get('/examined', [applicantController::class, 'examinedResult'])->name('examined.result');

    Route::get('/exam-permit/{applicant}', [PdfController::class, 'examPermit'])->name('pdf.examPermit');
    Route::get('/report', [PdfController::class, 'index'])->name('reports.index');
    Route::get('/report/seatRecord', [PdfController::class, 'seatRecord'])->name('pdf.seatRecord');
    Route::get('/report/seatPlan', [PdfController::class, 'seatPlan'])->name('pdf.seatPlan');
    Route::get('/report/result', [PdfController::class, 'result'])->name('pdf.result');

    Route::get('/applicant/donwloadFormat', [applicantController::class, 'downloadExcel'])->name('download.applicantFormat');
    
    Route::resource('examroom', ExamRoomController::class);
    Route::get('examroom/{examroom}/{seat}', [ExamRoomController::class,'seat'])->name('examroom.seat');
    Route::put('examroom/assign/{examroom}/{seats}/{applicant}', [ExamRoomController::class,'assign'])->name('examroom.assign');
    Route::get('api/examroom/search', [ExamRoomController::class,'search'])->name('examroom.search');

    //settings
    Route::get('/settings', [SettingsController::class,'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class,'addDate'])->name('date.add');
    Route::put('/settings/{examDate}', [SettingsController::class,'updateDate'])->name('date.assign');

    Route::post('/settings/shift', [SettingsController::class,'addShift'])->name('shift.add');
    Route::put('/settings/shift/{examTime}', [SettingsController::class,'updateTime'])->name('shift.assign');
    //Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');



});

require __DIR__.'/auth.php';
