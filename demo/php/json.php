<?php
$page = $_GET['page'];
$arr = array(
    'flag' => 0,
    'data' => array(
        array (
            'position' => "第" . $page . "页",
            "name" => "朱轲瑾",
            "sex" => "1",
            "age" => "20",
        ),
        array (
            'position' => "第" . $page . "页",
            "name" => "朱轲瑾",
            "sex" => "1",
            "age" => "20",
        ),
        array (
            'position' => "第" . $page . "页",
            "name" => "朱轲瑾",
            "sex" => "1",
            "age" => "20",
        ),
        array (
            'position' => "第" . $page . "页",
            "name" => "朱轲瑾",
            "sex" => "1",
            "age" => "20",
        ),
        array (
            'position' => "第" . $page . "页",
            "name" => "朱轲瑾",
            "sex" => "1",
            "age" => "20",
        )
    )
);

echo json_encode($arr);