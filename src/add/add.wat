;; 2つの整数を足した結果を返すモジュール。
;; JavaScript から何も受け取らないので、import はない。
(module
  ;; JavaScript から呼べる関数 "add" を公開する。
  ;; i32 型（32ビットの整数）の引数を2つ受け取り、i32 型の結果を1つ返す。
  (func (export "add") (param $left i32) (param $right i32) (result i32)
    ;; 2つの引数を順に積んでから、足し算をする。
    ;; 最後に積まれている値が、そのまま関数の結果になる。
    local.get $left
    local.get $right
    i32.add
  )
)
