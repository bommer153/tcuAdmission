<?php

namespace App\Http\Controllers;

use App\Models\ActionLogs;
use Illuminate\Support\Facades\Auth;
use TCPDF;
use Illuminate\Http\Request;
use App\Models\applicant;
use App\Models\ExamRoom;
use App\Models\ExamDate;
use App\Models\ExamTime;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Storage;

class PdfController extends Controller
{
    public function examPermit(applicant $applicant, Request $request)
    {

        $applicantName = ucwords(strtolower("{$applicant['first_name']} {$applicant['middle_name']} {$applicant['last_name']}"));

        ActionLogs::create([
            'action' => 'reprint',
            'user_id' => Auth::id(),
            'target_id' => $applicant->id,
            'metadata' => json_encode([
                'changed_fields' => null,
                'previous_values' => null,
                'new_values' => null,
                'description' => "Re-print applicant: \"$applicantName\""
            ]),
        ]);

        // Create new TCPDF instance
        $pdf = new TCPDF('L', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->setCreator(PDF_CREATOR);
        $pdf->setAuthor('TCU-MIS');
        $pdf->setTitle("Exam Permit");
        $pdf->setSubject('TCU Permit');
        $pdf->setKeywords('TCU, Permit');

        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);

        // set default monospaced font
        $pdf->setDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $pdf->SetMargins(PDF_MARGIN_LEFT, '10', PDF_MARGIN_RIGHT);
        $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);


        // set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // set some language-dependent strings (optional)
        if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
            require_once(dirname(__FILE__) . '/lang/eng.php');
            $pdf->setLanguageArray($l);
        }

        // ---------------------------------------------------------

        // set font
        $pdf->setFont('helvetica', '', 10);

        //date 
        $y = date("Y");
        $y1 = $y + 1;

        // add a page 
        $resolution = array(215.9, 355.6);
        $pdf->AddPage('P', $resolution);

        $html = "
        <div style=\"text-align:center;\">
            <span style=\"font-family: times;font-size:18px;font-weight:bold;\">Taguig City University</span><br>
            <span style=\"font-family: Arial;\">Gen. Santos Ave., Central Bicutan, Taguig City</span><br>
            <span style=\"font-family: Arial;font-weight:bold;\">TAGUIG CITY UNIVERSITY COLLEGE ENTRANCE EXAM</span><br>
            <span style=\"font-family: Arial;font-weight:bold;\">AY $y-$y1</span>
            <br><br>
            <span style=\"font-family: Arial;font-weight:bold;font-size:17px\">EXAMINATION PERMIT</span>
        </div>
        <br>
        <div>
            <span><b>APPLICATION NO</b> :</span><br><br>
            <span><b>DATE OF EXAMINATION</b> : ________________ <b>TIME</b> ______________ <b>ROOM NO.</b> _________ <b>SEAT NO.</b> _______</span>
            <br>
            <span>NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp; : ______________________________</span><br>
            <span>GENDER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : ______________________________</span><br>
            <span>CONTACT NUMBER &nbsp;: ______________________________</span><br>
            <span>ADDRESS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ___________________________________________________________________</span>
        </div>
        <div style=\"text-align:center;\">
            <span style=\"font-family: Arial;font-weight:bold;font-size:17px\">IMPORTANT REMINDERS</span>
        </div>
        <div style=\"font-size:13px;\">
            <span>1. Please print and bring this permit on the date of examination.</span><br>
            <span>2. <b>NO PERMIT, NO EXAMINATION</b>. This policy is strictly implemented.</span><br>
            <span>3. <b>NO SHOW</b> on scheduled date shall mean <b>INVALIDATION</b> of the admission application. <b>RESCHEDULING OF TEST IS NOT ALLOWED.</b></span><br>
            <span>4. <b>WEAR PROPER ATTIRE</b>: Wear a <b>WHITE TOP</b> (polo shirt with or without collar, blouse), decent pants or slacks, skirt on examination day. You are <b>not allowed</b> to wear a sleeveless shirt/blouse/dress, shorts or pants (skinny/reap jeans, leggings), and slippers.</span><br>
            <span>5. Bringing gadgets, including smartphones and watches, calculators, and all other similar items are <b>NOT ALLOWED</b>.</span><br>
            <span>6. Bring the following items and put it in transparent plastic envelope: <b>Printed Test Permit</b>, <b>VALID ID</b>, <b>BLACK Ballpen</b> (2 pcs), and Bottled drinking water.</span><br>
            <span>7. The list of successful examinees shall be uploaded/posted on the <b>TCU FACEBOOK PAGES</b> and at the <b>TCU Lobby</b>. </span>
        </div><br>
        ";
        //-----------

        $html .= "<br><br><br>
        <div style=\"text-align:center;\">
            <span style=\"font-family: times;font-size:18px;font-weight:bold;\">Taguig City University</span><br>
            <span style=\"font-family: Arial;\">Gen. Santos Ave., Central Bicutan, Taguig City</span><br>
            <span style=\"font-family: Arial;font-weight:bold;\">TAGUIG CITY UNIVERSITY COLLEGE ENTRANCE EXAM</span><br>
            <span style=\"font-family: Arial;font-weight:bold;\">AY $y-$y1</span>
            <br><br>
            <span style=\"font-family: Arial;font-weight:bold;font-size:17px\">EXAMINATION PERMIT</span>
        </div>
        <br>
        <div>
            <span><b>APPLICATION NO</b> :</span><br><br>
            <span><b>DATE OF EXAMINATION</b> : ________________ <b>TIME</b> ______________ <b>ROOM NO.</b> _________ <b>SEAT NO.</b> _______</span>
            <br>
            <span>NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp; : ______________________________</span><br>
            <span>GENDER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : ______________________________</span><br>
            <span>CONTACT NUMBER &nbsp;: ______________________________</span><br>
            <span>ADDRESS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ___________________________________________________________________</span>
        </div>
        <div style=\"text-align:center;\">
            <span style=\"font-family: Arial;font-weight:bold;font-size:17px\">IMPORTANT REMINDERS</span>
        </div>
        <div style=\"font-size:13px;\">
            <span>1. Please print and bring this permit on the date of examination.</span><br>
            <span>2. <b>NO PERMIT, NO EXAMINATION</b>. This policy is strictly implemented.</span><br>
            <span>3. <b>NO SHOW</b> on scheduled date shall mean <b>INVALIDATION</b> of the admission application. <b>RESCHEDULING OF TEST IS NOT ALLOWED.</b></span><br>
            <span>4. <b>WEAR PROPER ATTIRE</b>: Wear a <b>WHITE TOP</b> (polo shirt with or without collar, blouse), decent pants or slacks, skirt on examination day. You are <b>not allowed</b> to wear a sleeveless shirt/blouse/dress, shorts or pants (skinny/reap jeans, leggings), and slippers.</span><br>
            <span>5. Bringing gadgets, including smartphones and watches, calculators, and all other similar items are <b>NOT ALLOWED</b>.</span><br>
            <span>6. Bring the following items and put it in transparent plastic envelope: <b>Printed Test Permit</b>, <b>VALID ID</b>, <b>BLACK Ballpen</b> (2 pcs), and Bottled drinking water.</span><br>
            <span>7. The list of successful examinees shall be uploaded/posted on the <b>TCU FACEBOOK PAGES</b> and at the <b>TCU Lobby</b>. </span>
        </div><br>
        ";


        // output the HTML content
        $pdf->writeHTML($html, true, false, true, false, '');

        // Output the PDF (D for download, I for inline display)

        $style = array(
            'position' => '',
            'align' => 'C',
            'stretch' => false,
            'fitwidth' => true,
            'cellfitalign' => '',
            'border' => false,
            'hpadding' => 'auto',
            'vpadding' => 'auto',
            'fgcolor' => array(0, 0, 0),
            'bgcolor' => false, //array(255,255,255),
            'text' => true,
            'font' => 'helvetica',
            'fontsize' => 8,
            'stretchtext' => 4
        );

        // set style for barcode
        $qr = array(
            'border' => false,
            'vpadding' => 'auto',
            'hpadding' => 'auto',
            'fgcolor' => array(0, 0, 0),
            'bgcolor' => false, //array(255,255,255)
            'module_width' => 1, // width of a single module in points
            'module_height' => 1 // height of a single module in points
        );

        $pdf->SetXY(165, 10);
        $pdf->Image(public_path('storage/snap/' . $applicant->image_captured), '', '', 40, 40, '', '', 'T', false, 300, '', false, false, 1, false, false, false);

        //2nd Picture
        $pdf->SetXY(165, 170);
        $pdf->Image(public_path('storage/snap/' . $applicant->image_captured), '', '', 40, 40, '', '', 'T', false, 300, '', false, false, 1, false, false, false);

        // Barcode 1
        $pdf->SetXY(10, 9, true);
        $pdf->write2DBarcode("$applicant->last_name ($applicant->exam_date, $applicant->exam_time, $applicant->exam_room_no, $applicant->exam_seat_no)", 'QRCODE,L', '', '', 35, 35, $qr, 'N');
        //$pdf->Text(20, 25, 'QRCODE L');

        // QR Code 1
        //$pdf->SetXY(12,10,true);
        //$pdf->write1DBarcode("$date", 'UPCE', '', '', '', 18, 0.4, $style, 'N');

        // QR Code 2
        $pdf->SetXY(10, 170, true);
        $pdf->write2DBarcode("$applicant->last_name ($applicant->exam_date, $applicant->exam_time, $applicant->exam_room_no, $applicant->exam_seat_no)", 'QRCODE,L', '', '', 35, 35, $qr, 'N');

        // Barcode 2
        //$pdf->SetXY(12,170,true);
        //$pdf->write1DBarcode("$date", 'UPCE', '', '', '', 18, 0.4, $style, 'N');

        //1st Watermark
        $pdf->SetXY(35, 10);
        // set alpha to semi-transparency
        $pdf->SetAlpha(0.1);
        $pdf->Image(public_path('storage/source/tcu.png'), '', '', 150, 150, '', '', 'T', false, 300, '', false, false, 1, '', true, 72);
        //$pdf->Image('../images/tcu-wm.png', '', '', 150, 150, '', '', 'T', false, 300, '', false, false, 1, '', true, 72);

        //2nd Watermark
        $pdf->SetXY(35, 175);
        $pdf->Image(public_path('storage/source/tcu.png'), '', '', 150, 150, '', '', 'T', false, 300, '', false, false, 1, '', true, 72);
        //

        //DATA OUTPUT!!!
        $pdf->SetAlpha(1);
        //Upper Output------------------------------
        //Exam Date
        $pdf->SetXY(48, 48, true);
        $pdf->Cell(0, 0, "$applicant->id", 0, 1, 'L');

        $pdf->SetXY(64, 57, true);
        $pdf->Cell(0, 0, "$applicant->exam_date", 0, 1, 'L');

        //Exam Batch
        $pdf->SetXY(101, 57, true);
        $pdf->Cell(0, 0, "$applicant->exam_time", 0, 1, 'L');

        //Room No.
        $pdf->SetXY(153, 57, true);
        $pdf->Cell(0, 0, "$applicant->exam_room_no", 0, 1, 'L');

        //Seat No.
        $pdf->SetXY(188, 57, true);
        $pdf->Cell(0, 0, "$applicant->exam_seat_no", 0, 1, 'L');

        //Name
        $pdf->SetXY(52, 62, true);
        $pdf->Cell(0, 0, "$applicant->last_name, $applicant->first_name $applicant->middle_name", 0, 1, 'L');

        //Gender
        $pdf->SetXY(52, 66, true);
        $pdf->Cell(0, 0, "$applicant->sex", 0, 1, 'L');

        //Contact Number
        $pdf->SetXY(52, 70, true);
        $pdf->Cell(0, 0, "$applicant->contact_no", 0, 1, 'L');

        //Address
        $pdf->SetXY(52, 75, true);
        $pdf->Cell(0, 0, "$applicant->address $applicant->barangay", 0, 1, 'L');
        //------------------------------

        //Lower Output------------------------------
        //Exam Date
        $pdf->SetXY(48, 214, true);
        $pdf->Cell(0, 0, "$applicant->id", 0, 1, 'L');

        $pdf->SetXY(64, 223, true);
        $pdf->Cell(0, 0, "$applicant->exam_date", 0, 1, 'L');

        //Exam Batch
        $pdf->SetXY(101, 223, true);
        $pdf->Cell(0, 0, "$applicant->exam_time", 0, 1, 'L');

        //Room No.
        $pdf->SetXY(153, 223, true);
        $pdf->Cell(0, 0, "$applicant->exam_room_no", 0, 1, 'L');

        //Seat No.
        $pdf->SetXY(188, 223, true);
        $pdf->Cell(0, 0, "$applicant->exam_seat_no", 0, 1, 'L');

        //Name
        $pdf->SetXY(52, 228, true);
        $pdf->Cell(0, 0, "$applicant->last_name, $applicant->first_name $applicant->middle_name", 0, 1, 'L');

        //Gender
        $pdf->SetXY(52, 232, true);
        $pdf->Cell(0, 0, "$applicant->sex", 0, 1, 'L');

        //Contact Number
        $pdf->SetXY(52, 237, true);
        $pdf->Cell(0, 0, "$applicant->contact_no", 0, 1, 'L');

        //Address
        $pdf->SetXY(52, 241, true);
        $pdf->Cell(0, 0, "$applicant->address $applicant->barangay", 0, 1, 'L');

        $style = array('width' => 0.5, 'cap' => 'round', 'dash' => '2,2,2,2', 'phase' => 0, 'color' => array(255, 0, 0));
        $pdf->Line(10, 165, 205, 165, $style);
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



        ob_end_clean();

        return response($pdf->Output('exam_permit.pdf', 'I'))->header('Content-Type', 'application/pdf');
    }

    public function index()
    {

        $examDate = ExamDate::get();
        $examTime = ExamTime::get();
        $examRooms = ExamRoom::get();

        $applicantResultExam = DB::table('applicants')
            ->select(
                DB::raw("CONCAT(first_name, ' ', middle_name, ' ', last_name) as name"),
                DB::raw("(((((g11_gwa1 + g11_gwa2) / 2) * 0.8) + (g12_gwa1 * 0.2))) * 0.4 as gwascore"),
                DB::raw("(((exam_score / 150) * 100 * 0.5) + 50) * 0.6 as final_exam_score"),
                DB::raw("(((g11_gwa1 + g11_gwa2) / 2 * 0.8 + g12_gwa1 * 0.2) * 0.4) + ((((exam_score / 150) * 100 * 0.5) + 50) * 0.6) as overall"),
                'exam_score',
                'first_course as firstChoice',
                'second_course as secondChoice',
                'third_course as thirdChoice'
            )
            //   -where('status', '') // original code
            ->whereNotNull('printed_by')
            ->orderBy('overall', 'desc')
            ->get();

        return inertia('reports/index', [
            'success' => session('success'),
            'examDates' => $examDate,
            'examTimes' => $examTime,
            'examRooms' => $examRooms,
            'applicantResultExam' => $applicantResultExam,
        ]);
    }


    public function seatRecord()
    {
        $date = $_GET['date'];
        $time = $_GET['time'];
        $room = $_GET['room'];

        if (isset($date, $time, $room)) {
            $seatRecord = applicant::select('*')->where([
                'exam_date' => $date,
                'exam_time' => $time,
                'exam_room_no' => $room
            ])->orderByRaw("
            CASE 
                WHEN exam_seat_no LIKE 'L%' THEN 1
                WHEN exam_seat_no LIKE 'R%' THEN 2
                ELSE 3 
                END ASC,
                CAST(SUBSTRING(exam_seat_no, 2) AS UNSIGNED) ASC
             ")->get();

            $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);



            // set document information
            $pdf->setCreator(PDF_CREATOR);
            $pdf->setAuthor('TCU-MIS');
            $pdf->setTitle("Seat Report - Room: $room Exam Date: $date Shift: $time");
            $pdf->setSubject('TCU Report');
            $pdf->setKeywords('TCU, Seat, Report');

            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);
            //$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
            //$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

            // set default monospaced font
            $pdf->setDefaultMonospacedFont(PDF_FONT_MONOSPACED);

            // set margins
            $pdf->SetMargins(PDF_MARGIN_LEFT, '10', PDF_MARGIN_RIGHT);
            $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
            $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

            // set image scale factor
            $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

            // set some language-dependent strings (optional)
            if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
                require_once(dirname(__FILE__) . '/lang/eng.php');
                $pdf->setLanguageArray($l);
            }

            // ---------------------------------------------------------

            // add a page 
            $resolution = array(215.9, 355.6);
            $pdf->AddPage('P', $resolution);

            $pdf->SetXY(30, 10);
            $pdf->Image(public_path('storage/source/taguig.png'), '', '', 20, 20, '', '', 'T', false, 300, '', false, false, 1, false, false, false);

            $pdf->SetXY(165, 10);
            $pdf->Image(public_path('storage/source/tcu.png'), '', '', 20, 20, '', '', 'T', false, 300, '', false, false, 1, false, false, false);

            $pdf->setFont('helvetica', '', 12);

            // ROOM
            $pdf->SetXY(46, 47, true);
            $pdf->Cell(0, 0, "$room", 0, 1);

            // EXAM DATE
            $nedate = date("M d, Y", strtotime($date));
            $pdf->SetXY(95, 47, true);
            $pdf->Cell(0, 0, "$nedate", 0, 1);

            // BATCH 
            $pdf->SetXY(156, 47, true);
            $pdf->Cell(0, 0, "$time", 0, 1);

            $y = date('Y');
            $y1 = $y + 1;
            $pdf->setFont('helvetica', '', 10);
            $pdf->SetXY(10, 10);
            $html = "
            <div style=\"text-align:center;\">
                <span style=\"font-family: times;font-size:18px;font-weight:bold;\">Taguig City University</span><br>
                <span style=\"font-family: Arial;\">Gen. Santos Ave. Central Bicutan, Taguig City</span><br>
                <span style=\"font-family: Arial;font-weight:bold;\">TAGUIG CITY UNIVERSITY SCHOLASTIC ADMISSION</span><br>
                <span style=\"font-family: Arial;font-weight:bold;\">TEST (TCU SAT)</span><br>
                <span style=\"font-family: Arial;font-weight:bold;\">A.Y. $y-$y1</span>
                <br><br>
                <span style=\"font-family: Arial;font-weight:bold;font-size:17px\">EXAMINATION SEAT REPORT</span>
            </div>
            <div style=\"text-align:center\">
                <span><b>ROOM</b> : _________ <b>EXAM DATE</b> : ______________________ <b>TIME/BATCH</b> : ___________________
            </div>
            <br>
            <table cellspacing=\"0\" cellpadding=\"4\">
                <tr>
                    <th style=\"width:25%\"></th>
                    <th style=\"width:10%;border:1px solid black\"><b>Seat</b></th>
                    <th style=\"width:40%;border:1px solid black\"><b>Name</b></th>
                </tr>";



            foreach ($seatRecord as $seatRecord) {
                $html .= "<tr>
                            <td></td>
                            <td style=\"border:1px solid black\">$seatRecord->exam_seat_no</td>
                            <td style=\"border:1px solid black\">$seatRecord->last_name, $seatRecord->first_name $seatRecord->middle_name</td>
                        </tr>";
            }

            $html .= "
            </table>
            ";

            $pdf->writeHTML($html, true, false, true, false, '');

            $pdf->SetXY(150, 312);
            $pdf->SetFont('Helvetica', 'B', 10);
            $pdf->Cell(20, 7, 'Eng. Ferdinand E. Rubio', 0, 0, 'C');
            $pdf->Ln();
            $pdf->SetXY(150, 317);
            $pdf->SetFont('Helvetica', 'I', 10);
            $pdf->Cell(20, 7, 'MIS Director', 0, 0, 'C');
            $pdf->Ln();

            ob_end_clean();
            //Close and output PDF document
            //$pdf->Output("$p_name $p_edate $p_batch $p_room $p_seat.pdf", 'I');

            $edate = date("MdY", strtotime($date));

            $batch = str_replace(':', '-', $time);
            $batch = str_replace(' ', '', $time);
            $pdf->Output("SeatReport $edate $batch $room.pdf", 'I');
        }
    }

    public function seatPlan()
    {
        $date = $_GET['date'];
        $time = $_GET['time'];
        $room = $_GET['room'];

        if (isset($date, $time, $room)) {
            $seatRecord = applicant::select('*')->where([
                'exam_date' => $date,
                'exam_time' => $time,
                'exam_room_no' => $room
            ])->orderByRaw("
            CASE 
                WHEN exam_seat_no LIKE 'L%' THEN 1
                WHEN exam_seat_no LIKE 'R%' THEN 2
                ELSE 3 
                END ASC,
                CAST(SUBSTRING(exam_seat_no, 2) AS UNSIGNED) ASC
             ")->get();

            //dd($seatRecord);
            $pdf = new TCPDF('L', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);



            // set document information
            $pdf->setCreator(PDF_CREATOR);
            $pdf->setAuthor('TCU-MIS');
            $pdf->setTitle("Seat Report - Room: $room Exam Date: $date Shift: $time");
            $pdf->setSubject('TCU Report');
            $pdf->setKeywords('TCU, Seat, Report');

            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);
            //$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
            //$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

            // set default monospaced font
            $pdf->setDefaultMonospacedFont(PDF_FONT_MONOSPACED);

            // set margins
            $pdf->SetMargins(PDF_MARGIN_LEFT, '10', PDF_MARGIN_RIGHT);
            $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
            $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

            // set image scale factor
            $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

            // set some language-dependent strings (optional)
            if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
                require_once(dirname(__FILE__) . '/lang/eng.php');
                $pdf->setLanguageArray($l);
            }

            // ---------------------------------------------------------

            // add a page 
            $resolution = array(215.9, 355.6);
            $pdf->AddPage('L', $resolution);

            $pdf->SetXY(10, 10, true);
            $pdf->setFont('helvetica', 'B', 18);
            $pdf->Cell(0, 0, "FRESHMEN ---/--- Room $room ---/--- $time ---/--- $date", 0, 1, 'C');

            $pdf->setFont('helvetica', '', 12);

            $s = 0;
            $j = 0;
            $i = 1;
            foreach ($seatRecord as $seatRecord) {

                $pdf->SetXY(10 + $s, 30 + $j);
                $pdf->Image(public_path('storage/snap/' . $seatRecord->image_captured), '', '', 50, 50, '', '', 'T', false, 300, '', false, false, 1, false, false, false);
                $pdf->SetXY(10 + $s, 81 + $j);
                $pdf->Cell(0, 0, $seatRecord->exam_seat_no, 0, 1, 'L');
                $pdf->SetXY(10 + $s, 86 + $j);
                $pdf->MultiCell(55, 6, strtoupper($seatRecord->last_name) . ", " . strtoupper($seatRecord->first_name) . " " . substr(strtoupper($seatRecord->middle_name), 0, 1), '', '', 0, 1, '', '', true);


                $s = $s + 70;
                $i++;

                if ($i == 6) {
                    $s = 0;
                    $j = $j + 80;
                }

                if ($i > 10) {
                    $s = 0;
                    $i = 1;
                    $j = 0;

                    $pdf->AddPage('L', $resolution);
                    $pdf->SetXY(10, 10, true);
                    $pdf->setFont('helvetica', '', 12);
                    $pdf->Cell(0, 0, "FRESHMEN ---/--- Room $room ---/--- $time ---/--- $date", 0, 1, 'C');
                }
            }

            ob_end_clean();

            $edate = date("MdY", strtotime($date));
            $batch = str_replace(':', '-', $time);
            $batch = str_replace(' ', '', $time);
            $pdf->Output("SeatPlan $edate $batch $room.pdf", 'I');
        }
    }

    public function result()
    {


        if (isset($_GET['counts'])) {
            $count = $_GET['counts'];
        } else {
            $count = 1;
        }

        // SELECT COUNT(*), status FROM `applicants` WHERE printed_by IS NOT null GROUP BY status 

        $applicants = DB::table('applicants')
            ->select(
                DB::raw("CONCAT(first_name, ' ', middle_name, ' ', last_name) as name"),
                DB::raw("(((((g11_gwa1 + g11_gwa2) / 2) * 0.8) + (g12_gwa1 * 0.2))) * 0.4 as gwascore"),
                DB::raw("(((exam_score / 150) * 100 * 0.5) + 50) * 0.6 as final_exam_score"),
                DB::raw("(((g11_gwa1 + g11_gwa2) / 2 * 0.8 + g12_gwa1 * 0.2) * 0.4) + ((((exam_score / 150) * 100 * 0.5) + 50) * 0.6) as overall"),
                'exam_score',
                'first_course as firstChoice',
                'second_course as secondChoice',
                'third_course as thirdChoice'
            )
            //   -where('status', '') // original code
            ->whereNotNull('printed_by')
            ->orderBy('overall', 'desc')
            ->take($count)
            ->get();

        $pdf = new TCPDF('L', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        $resolution = array(215.9, 355.6);
        $pdf->AddPage('P', $resolution);
        //$pdf->AddPage('L', $resolution);

        $pdf->SetXY(35, 10);
        $pdf->Image(public_path('storage/source/taguig.png'), '', '', 20, 20, '', '', 'T', false, 300, '', false, false, 1, false, false, false);

        $pdf->SetXY(165, 10);
        $pdf->Image(public_path('storage/source/tcu.png'), '', '', 20, 20, '', '', 'T', false, 300, '', false, false, 1, false, false, false);

        $pdf->setFont('helvetica', '', 12);
        $pdf->SetXY(10, 10);
        $y = date('Y');
        $y1 = $y + 1;
        $html = "
        <div style=\"text-align:center;\">
            <span style=\"font-family: times;font-size:18px;font-weight:bold;\">Taguig City University</span><br>
            <span style=\"font-family: Arial;\">Gen. Santos Ave. Central Bicutan, Taguig City</span><br>
            <span style=\"font-family: Arial;font-weight:bold;\">TAGUIG CITY UNIVERSITY COLLEGE ENTRANCE EXAM</span><br>
            <span style=\"font-family: Arial;font-weight:bold;\">A.Y. $y-$y1</span>
            <br><br>
            <span style=\"font-family: Arial;font-weight:bold;font-size:13px\">Examination Score Report (Freshmen)</span>
        </div>
        <br>";

        $html .= "
        <table cellspacing=\"0\" cellpadding=\"4\">
	        <tr>
		<th style=\"width:5%;border:1px solid black;text-align:center;font-size:11px;font-weight:bold\">#</th>
		<th style=\"width:20%;border:1px solid black;text-align:center;font-size:11px;font-weight:bold\">Name</th>
		<th style=\"width:10%;border:1px solid black;text-align:center;font-size:11px;font-weight:bold\">Overall</th>
		<th style=\"width:10%;border:1px solid black;text-align:center;font-size:11px;font-weight:bold\">Exam (60%)</th>
		<th style=\"width:10%;border:1px solid black;text-align:center;font-size:11px;font-weight:bold\">GWA (40%)</th>
		<th style=\"width:15%;border:1px solid black;text-align:center;font-size:11px;font-weight:bold\">1st Choice</th>
		<th style=\"width:15%;border:1px solid black;text-align:center;font-size:11px;font-weight:bold\">2nd Choice</th>
		<th style=\"width:15%;border:1px solid black;text-align:center;font-size:11px;font-weight:bold\">3rd Choice</th>
	        </tr>";



        $cnt = 1;

        foreach ($applicants as $applicant) {
            $html .= "<tr>
            <th style=\"width:5%;border:1px solid black;text-align:center;font-size:8px;\">$cnt</th>
            <th style=\"width:20%;border:1px solid black;text-align:center;font-size:10px\">$applicant->name</th>
            <th style=\"width:10%;border:1px solid black;text-align:center;font-size:10px\">$applicant->overall</th>
            <th style=\"width:10%;border:1px solid black;text-align:center;font-size:10px\">($applicant->final_exam_score) $applicant->exam_score</th>
            <th style=\"width:10%;border:1px solid black;text-align:center;font-size:10px\">$applicant->gwascore</th>
            <th style=\"width:15%;border:1px solid black;text-align:center;font-size:9px\">$applicant->firstChoice</th>
            <th style=\"width:15%;border:1px solid black;text-align:center;font-size:9px\">$applicant->secondChoice</th>
            <th style=\"width:15%;border:1px solid black;text-align:center;font-size:9px\">$applicant->thirdChoice</th>
            </tr>";

            $cnt++;
        }

        $html .= "<tr>
		<td></td>
		<td></td>
		<td colspan=\"6\"><b style=\"font-size:12px;text-align:right\">Total:" . $applicants->count() . "<br><br><br><br><br>Engr. Ferdinand E. Rubio<br>MIS Director</b></td>
		</tr>
        </table>
        ";

        $pdf->writeHTML($html, true, false, true, false, '');

        ob_end_clean();


        $pdf->Output("Result.pdf", 'I');
    }
}
