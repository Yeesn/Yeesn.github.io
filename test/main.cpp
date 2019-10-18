#include<iostream>
#include "car.h"
using namespace std;
void fun()
{
    cout << "fun() +++" << endl;
    car<int> a(99);
    a.print();
}
int main()
{
    fun();
    return 0;
}