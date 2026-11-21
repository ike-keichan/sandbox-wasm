;; JavaScript から受け取ったメモリに文字列を書き込み、JavaScript の関数を呼んで表示させるモジュール。
(module
  ;; JavaScript の関数を、WebAssembly の関数として使えるようにする。
  ;; "env" "print_string" は、JavaScript から渡されるオブジェクトの env.print_string を指す。
  ;; この関数は、i32 型の引数を1つ受け取る（文字列の長さ）。
  (import "env" "print_string" (func $print_string (param i32)))

  ;; JavaScript が用意した線形メモリを使う。大きさは1ページ（64KiB）以上。
  (import "env" "memory" (memory 1))

  ;; 文字列を書き込む位置を、JavaScript から受け取る。
  (global $start_string_index (import "env" "start_string_index") i32)

  ;; 文字列の長さ。"hello world!" は12バイト。
  (global $string_length i32 (i32.const 12))

  ;; 線形メモリの $start_string_index の位置に、文字列を書き込む。
  (data (global.get $start_string_index) "hello world!")

  ;; JavaScript から呼べる関数 "hello_world" を公開する。
  ;; 呼ばれたら、文字列の長さを引数にして、$print_string を呼ぶ。
  (func (export "hello_world")
    (call $print_string (global.get $string_length))
  )
)
