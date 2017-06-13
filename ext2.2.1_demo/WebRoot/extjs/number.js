/*
 * 将浮点数进行格式化
 * value:待格式化浮点数
 * num:精度，小数点后保留的位数。如果位数不足，0替补。
 */
function formatDecimal_f(value,num)
{
   var f_value = parseFloat(value);
   if (isNaN(f_value))
   {
      
   	return "";
      
   }
   //var f_value = Math.round(value*10000)/10000;
   f_value = f_value.toFixed(num);
   
   var s_value = f_value.toString();
   var pos_decimal = s_value.indexOf('.');
   if (pos_decimal < 0)
   {
      pos_decimal = s_value.length;
      s_value += '.';
   }
   while (s_value.length <= pos_decimal + num)
   {
      s_value += '0';
   }
   return s_value;
}
